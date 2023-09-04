import { RemoveSpecialCharactersPipe } from './remove-special-characters.pipe';

describe('RemoveSpecialCharactersPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveSpecialCharactersPipe();
    expect(pipe).toBeTruthy();
  });
});
