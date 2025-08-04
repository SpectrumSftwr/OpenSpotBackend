import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';


@Injectable()
export class EventBusService {

  private emitter = new EventEmitter2();

  emit(event: string, payload: any) {
    this.emitter.emit(event, payload);
  }

  on(event: string, handler: (payload: any) => void) {
    this.emitter.on(event, handler);
  }
}
