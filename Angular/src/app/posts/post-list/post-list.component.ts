import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading: boolean;
  isAuthenticated: boolean;
  authenticatedUserId: string | null;
  private postsSubscription: Subscription;
  private isAuthSubscription: Subscription;

  //paginator variables
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 3, 5, 10, 20];

  constructor(
    public postsService: PostsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.fetchPosts(this.postsPerPage, 1);
    this.postsSubscription = this.postsService
      .getPostAddedObservable() //consigo el observable que emite valores cada vez que se updatean los posts
      .subscribe((postsData: { posts: Post[]; totalPosts: number }) => {
        // y actualizo la lista de posts cada vez que cambia
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPosts = postsData.totalPosts;
      });

    this.isAuthenticated = this.authService.getAuthStatus();
    this.authenticatedUserId = this.authService.getUserId();
    this.isAuthSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.authenticatedUserId = this.authService.getUserId();
      });
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe(); //hasta la proximaaaaaaaa
    this.isAuthSubscription.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id).subscribe(
      () => {
        this.postsService.fetchPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.fetchPosts(this.postsPerPage, this.currentPage);
  }
}
