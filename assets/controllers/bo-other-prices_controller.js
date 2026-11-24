import { Controller } from '@hotwired/stimulus';

/**
 * The tabs of the "Other prices" block: a dot on the tab whose form holds changes, so that a
 * change made in a tab out of sight is not forgotten. Each tab saves its own form; leaving the
 * page with one changed is the business of bo-unsaved-changes.
 */
export default class extends Controller {
    static targets = ['tab', 'panel'];

    connect() {
        this.onChange = (event) => this.mark(event.target, true);
        this.onReset = (event) => this.mark(event.target, false);
        this.element.addEventListener('input', this.onChange);
        this.element.addEventListener('change', this.onChange);
        this.element.addEventListener('reset', this.onReset);
    }

    disconnect() {
        this.element.removeEventListener('input', this.onChange);
        this.element.removeEventListener('change', this.onChange);
        this.element.removeEventListener('reset', this.onReset);
    }

    mark(field, dirty) {
        // A search of the effective prices changes nothing to save.
        if (dirty && field.closest('form')?.method !== 'post') {
            return;
        }
        const panel = this.panelTargets.find((candidate) => candidate.contains(field));
        const tab = panel ? this.tabTargets.find((candidate) => candidate.getAttribute('aria-controls') === panel.id) : null;
        if (!tab) {
            return;
        }
        if (dirty) {
            tab.setAttribute('data-dirty', '');
        } else {
            tab.removeAttribute('data-dirty');
        }
    }
}
