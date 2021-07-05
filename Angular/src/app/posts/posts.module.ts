import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostListComponent } from './post-list/post-list.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PostListComponent,
    CreatePostComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ]
})
export class PostsModule { }
