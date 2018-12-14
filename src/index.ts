import { fromEvent } from 'rxjs';
import { debounceTime, map, switchMap, distinctUntilChanged, pluck } from 'rxjs/operators';

type GithubRepo = {name: string, html_url: string};

const input: HTMLInputElement = document.getElementById('input') as HTMLInputElement;
const output: HTMLDivElement = document.getElementById('output') as HTMLDivElement;

const inputObservable$ = fromEvent(input, 'keyup').pipe(
    debounceTime(300),
    pluck('target', 'value'),
    distinctUntilChanged(),
    switchMap(requestRepositories, (_searchStr: any, res: any) => res.items),    
    map((result: GithubRepo[]) => {
        clearOutput(output);
        if (!result) {
            output.appendChild(buildEmptyResult());
        } else {
            result.forEach((repo: GithubRepo) => {
                const row: HTMLElement = buildResultRow(repo);
                output.appendChild(row);
            });
        }
        return result;
    })
);

inputObservable$.subscribe((items) => {
    console.log('Request finished', items);    
});

function requestRepositories(searchString: any): any {
    console.log('Search string', searchString);
    return fetch(`https://api.github.com/search/repositories?q=${searchString}`).then(res => res.json());
}

function buildResultRow(repo: GithubRepo): HTMLElement {
    const element: HTMLElement = document.createElement('DIV');
    element.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    return element;
}

function buildEmptyResult(): HTMLElement {
    const element: HTMLElement = document.createElement('DIV');
    return element;
}

function clearOutput(output: HTMLDivElement): void {
    output.innerHTML = '';
}

// const sequence1$: Observable<number> = interval(1000).pipe(take(5));
//
// sequence1$.pipe(
//     mergeMap(() => of(1, 2)),
//     // tslint:disable-next-line
// ).subscribe((v: any) => {
//     // tslint:disable-next-line
//     console.log(v);
// });
// const clickObservable$ = fromEvent(document, 'click');

// // tslint:disable-next-line
// function performRequest(): any {
//     return fetch('https://jsonplaceholder.typicode.com/users/1')
//         .then(((res: Response) => res.json()));
// }

// clickObservable$
//     .pipe(
//         // tslint:disable-next-line
//         switchMap(() => performRequest(), (_click: Event, res: any) => res.email)
//     ).subscribe((email: string) => {
//     console.log(email);
// });

// Observable + observer = subject;

// const controlSequence$$: ReplaySubject<number> = new ReplaySubject(2);
// controlSequence$$.next(1);
// controlSequence$$.next(2);
// controlSequence$$.next(3);
// controlSequence$$.next(4);
// controlSequence$$.next(5);
//
// controlSequence$$.subscribe((value: number) => {
//     console.log(1, value);
// })

// controlSequence$$.next(6);
// controlSequence$$.next(7);
// controlSequence$$.next(8);

// controlSequence$$.complete();
//

// setTimeout(() => {
//     controlSequence$$.subscribe((value: number) => {
//         console.log(2, value);
//     });
// }, 5000)
// const controlSequence$$: Subject<number> = new Subject();

// const connectableObservable$: ConnectableObservable<number> = interval(1000)
//     .pipe(
//         publish()
//     ) as ConnectableObservable<number>;
//
// connectableObservable$.connect();
//
// connectableObservable$.subscribe((value: number) => {
//     console.log(`Sub 1 =>>>`, value);
// });
//
// setTimeout(() => {
//     connectableObservable$.subscribe((value: number) => {
//         console.log(`Sub 2 =>>>`, value);
//     });
// }, 5000);
// const arr: number [] = [];
// for (let i: number = 0; i < 10000; i++) {
//     arr.push(i);
// }
// console.log('Start');
// console.time('Schedule');
// from(arr).pipe(
//     observeOn(asap),
//     map((v: number) => v * 2 % 3)
// ).subscribe(() => {
// }, () => {
// }, () => {
//     console.timeEnd('Schedule');
// });
// console.log('End');
