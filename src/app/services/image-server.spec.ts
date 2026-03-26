import { TestBed } from '@angular/core/testing';

import { ImageServer } from './image-server';

describe('ImageServer', () => {
  let service: ImageServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
