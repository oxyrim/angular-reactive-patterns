import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Recipe } from '../model/recipe.model';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, startWith, switchAll, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const WS_ENDPOINT = environment.wsEndpoint;
@Injectable({
  providedIn: 'root',
})
export class RealTimeService {
  private socket$: WebSocketSubject<Recipe[]> | undefined;
  private messageSubject$ = new BehaviorSubject<Observable<Recipe[]>>(EMPTY);
  public message$ = this.messageSubject$.pipe(
    switchAll(),
    startWith([]),
    catchError((e) => {
      throw e;
    })
  );

  private getNewWebSocket(): WebSocketSubject<Recipe[]> {
    return webSocket(WS_ENDPOINT);
  }

  sendMessage(message: Recipe[]) {
    this.socket$?.next(message);
  }

  close() {
    this.socket$?.complete();
  }

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({ error: (error) => console.log(error) }),
        catchError((_) => EMPTY)
      );
      this.messageSubject$.next(messages);
    }
  }
}
