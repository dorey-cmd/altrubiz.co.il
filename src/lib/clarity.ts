import Clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'yj55u92ks2';

export function initClarity() {
    if (!import.meta.env.PROD) return;
    Clarity.init(CLARITY_PROJECT_ID);
}
