import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Recipe } from '../model/recipe.model';
import { BehaviorSubject, EMPTY, Observable, timer } from 'rxjs';
import { catchError, delayWhen, retryWhen, startWith, switchAll, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const RECONNECT_INTERVAL = environment.reconnectInterval;
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
    return webSocket({
      url: WS_ENDPOINT,
      closeObserver: {
        next: () => {
          console.log('[RealTimeService]: connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true })
        },
      },
    });
  }

  sendMessage(message: Recipe[]) {
    this.socket$?.next(message);
  }

  close() {
    this.socket$?.complete();
  }

  public connect(config: { reconnect: boolean } = { reconnect: false }): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        config.reconnect ? this.reconnect : o => o, 
        tap({ error: (error) => console.log(error) }),
        catchError((_) => EMPTY)
      );
      this.messageSubject$.next(messages);
    }
  }

  private reconnect(observable: Observable<Recipe[]>): Observable<Recipe[]> {
    return observable.pipe(
      retryWhen((errors) =>
        errors.pipe(
          tap((val) => console.log('[Data Service] Try to reconnect', val)),
          delayWhen((_) => timer(RECONNECT_INTERVAL))
        )
      )
    );
  }
}
