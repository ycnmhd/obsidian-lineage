import { writable } from 'svelte/store';
import type ExamplePlugin from './main';

const plugin = writable<ExamplePlugin>();
export default { plugin };
