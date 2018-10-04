/* global describe, beforeEach, it */
import { expect } from 'chai';
import { useFixture } from '../helpers';
import { interactor, blurrable } from '../../src';

const BlurInteractor = interactor(function() {
  this.blurInput = blurrable('.test-input');
});

describe('BigTest Interaction: blurrable', () => {
  let blurred, test, $input;

  useFixture('input-fixture');

  beforeEach(() => {
    blurred = false;
    $input = document.querySelector('.test-input');

    $input.addEventListener('blur', e => {
      blurred = e.target !== document.activeElement;
    });

    // Set focus on the element so we can check if blur has properly
    // been handled
    $input.focus();
    test = new BlurInteractor();
  });

  it('has blurrable methods', () => {
    expect(test).to.respondTo('blur');
    expect(test).to.respondTo('blurInput');
  });

  it('returns a new instance', () => {
    expect(test.blur('.test-input')).to.not.equal(test);
    expect(test.blur('.test-input')).to.be.an.instanceof(BlurInteractor);
    expect(test.blurInput()).to.not.equal(test);
    expect(test.blurInput()).to.be.an.instanceof(BlurInteractor);
  });

  it('eventually blurs the element', async () => {
    await expect(test.blur('.test-input').run()).to.be.fulfilled;
    expect(blurred).to.be.true;
  });

  it('eventually blurs the custom element', async () => {
    await expect(test.blurInput().run()).to.be.fulfilled;
    expect(blurred).to.be.true;
  });

  describe('overwriting the default blur method', () => {
    beforeEach(() => {
      test = new (interactor(function() {
        this.blur = blurrable('.test-input');
      }))();
    });

    it('blurs the correct element', async () => {
      await expect(test.blur().run()).to.be.fulfilled;
      expect(blurred).to.be.true;
    });
  });
});
