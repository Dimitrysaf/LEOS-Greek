import { UnescapeHtmlPipe } from './unescape-html.pipe';

describe('UnescapeHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new UnescapeHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
