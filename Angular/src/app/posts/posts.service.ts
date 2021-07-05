import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.BACKEND_URL + "posts/";


@Injectable({ providedIn: 'root' })
export class PostsService {


  private posts: Post[] = [];
  private postAdded = new Subject<{posts: Post[], totalPosts: number}>();

  constructor(public http: HttpClient, private router: Router) {}



  
  addPost(title: string, content: string, image: File) {
    //Im using formdata instead of plain JSON because Json does not support blob files (image).
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  /**
   * Fetchs the post from the node backend, stores them in an array and emits a new event that signals the change*/
  fetchPosts(pageSize: number, currentPage: number) {
    const queryParams = `?page=${currentPage}&pageSize=${pageSize}`;
    this.http
      .get<{ postAmount: number, posts:{ title: string; content: string; _id: string, imagePath: string, creator: string}[] }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postsData) => {
          return {postAmount: postsData.postAmount, posts: postsData.posts.map((post) => {
            return {
              id: post._id,
              content: post.content, //ugly ass code that converts node js id (_id) into angular id (id)
              title: post.title,
              imagePath: post.imagePath,
              creator: post.creator
            };
          })};
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postAdded.next({posts:[...this.posts], totalPosts: postData.postAmount});
      });
  }

  /** Returns delete post http request observable. Subscribe to it in the component and execute the logic you want to execute there.*/
  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
     
  }

  /**Updates post in node backend */
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if(typeof image === 'object'){ //If we have the image blob instead of the path we need formdate, cuz json cant handle blobs
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
    }
    else{
        postData = { id: id, title: title, content: content, imagePath: image, creator: null};
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  /**
   * Gets a post by id from node backend. Returns observable which then returns said post.
   * @param id
   */
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string, creator: string}>(
      BACKEND_URL + id
    );
  }

  getPostAddedObservable() {
    //devuelve una suscribe only copy del subject
    return this.postAdded.asObservable();
  }
}
