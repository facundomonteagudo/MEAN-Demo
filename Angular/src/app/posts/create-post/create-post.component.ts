import { Component, OnInit } from '@angular/core';
import { Post } from "../post.model";
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { imageTypeValidator} from "./image-type.validator";
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  post : Post;
  
  mode: string = "create";
  isLoading: boolean;
  postId: string | null;
  imageThumbnail: string | null;

  authStatusSubscription: Subscription;

  form: FormGroup;


  constructor(public postsService: PostsService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    //FORM 
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required], [imageTypeValidator])
    });

    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe((authStatus)=>{
      this.isLoading = false;
    })

    //DISSECTING THE URL TO SEE IF IM EDITING OR CREATING A POST
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
         this.mode = "edit";
         this.postId = paramMap.get('postId') as string;
         this.isLoading = true
         this.postsService.getPost(this.postId).subscribe(post =>{ //getpost is async and returns an observable
          this.isLoading = false;
          this.post = {id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, creator: post.creator}
          this.form.setValue({title: post.title, content: post.content, image: post.imagePath}); //fills the form group fields after we get the post
         });
      }
      else{
        this.mode = "create";
        this.postId = null;
      } 
    })
  }


  onFilePicked(event: Event){
    let file = ((event.target as HTMLInputElement).files as FileList)[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () =>{ // vanilla js async code
      this.imageThumbnail = fileReader.result as string;
    }
    fileReader.readAsDataURL(file); //executes the async code
  }

  onDou(){
    console.log(this.form);
    if(this.form.valid){
      if(this.mode === 'edit'){
        this.postsService.updatePost(this.postId as string, this.form.value.title, this.form.value.content, this.form.value.image);
      }
      else{
        this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      }
      this.form.reset();
    }
  }
}
