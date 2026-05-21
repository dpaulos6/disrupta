import { genericRssAdapter } from './adapters/generic-rss.adapter';
import { mockAdapter } from './adapters/mock.adapter';
export const adapterRegistry = [mockAdapter, genericRssAdapter];
