import { Component, OnInit } from '@angular/core';
import { MinioService } from '@hapiness/minio';

@Component({
  selector: 'app-minio-client',
  templateUrl: './minio-client.component.html',
  styleUrls: []
})
export class MinioClientComponent implements OnInit {

  public bucketName: string
  message: string
  buckets = []
  constructor(private minioService: MinioService) { }

  async ngOnInit() {
    
  
  }

 }
