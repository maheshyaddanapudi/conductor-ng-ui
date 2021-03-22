import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

const search_options: {name: string, action: string, url: string, description: string}[] = [
  {
    action: "navigate",
    name: "Create Task Definition",
    url: "/create/taskdefinition",
    description: "Create a new Task Definition, with Input & Output Fields and Metadata"
  },
  {
    action: "navigate",
    name: "Create Workflow Definition",
    url: "/create/workflowdefinition",
    description: "Create a new Workflow Definition, choosing tasks, with Input & Output Fields and Metadata"
  }
]

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
})

export class SearchBoxComponent implements OnInit {

  public isActive: any;

  public search_string: string

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : search_options.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: {name: string}) => x.name;

  constructor() { }

  ngOnInit() {

  }

}
