import { IObservable, IObserver } from '../utils/observable/types';
import { IView } from './types';
import { IMeasurement } from '../state/weather/types';
import { IArticle } from '../state/news/types';
import { NewsState } from '../state/news';
import { WeatherState } from '../state/weather';
import { Render } from '../utils/render';

export abstract class View implements IObserver, IView {
    protected abstract measurementsCount: number;
    protected abstract articlesCount: number;
    protected abstract viewName: string;
    private measurements: IMeasurement[] = [];
    private articles: IArticle[] = [];
    private previousRendering: string = '';

    public update(observable: IObservable) {
        if (observable instanceof WeatherState) {
            this.measurements = (observable as WeatherState)
                .getMeasurements()
                .slice(-this.measurementsCount);
        }
        if (observable instanceof NewsState) {
            this.articles = (observable as NewsState).getArticles().slice(-this.articlesCount);
        }
        this.render();
    }

    public render() {
        let rendering = '';
        rendering += `<div class="${this.viewName}">\n`;
        this.articles.forEach(a => {
            rendering += Render.getRenderedArticle(a);
        });
        this.measurements.forEach(m => {
            rendering += Render.getRenderedMeasurement(m);
        });
        rendering += '</div>';
        if (rendering !== this.previousRendering) {
            console.log(rendering);
            this.previousRendering = rendering;
        }
    }
}
