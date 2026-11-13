/**
 * Файл: `src/components/router/router-layout.tsx`
 * Предоставляет компонент RouterLayout для отображения каркаса приложения с шапкой
 * и outlet страниц.
 *
 * Основные задачи:
 * 1. Экспортировать компонент RouterLayout
 * 2. Передавать состояние шапки страницам через контекст outlet
 *
 * Потребители:
 *  - `src/components/router/router.tsx` — рендерит layout как корневой элемент маршрутов
 */

import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { DEFAULT_HEADER_AUTO_HIDE, Header } from '@components/header';
import {
  DEFAULT_PROFILE_MENU_EMAIL,
  DEFAULT_PROFILE_MENU_GREETING,
  DEFAULT_PROFILE_MENU_PRIVACY_LABEL,
  DEFAULT_PROFILE_MENU_PROFILE_LABEL,
  DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL,
  DEFAULT_PROFILE_MENU_TERMS_LABEL,
  type ProfileMenuProps,
} from '@components/profile-menu';

import {
  SHOWCASE_SIDEBAR_ID,
  type HeaderProfileMenuText,
  type ShellOutletContext,
} from './use-shell-outlet-context';

/**
 * SHOWCASE_PATH — задаёт путь маршрута витрины дизайн-системы.
 * Используется в `RouterLayout` для сравнения с текущим путём и перехода на витрину.
 */
const SHOWCASE_PATH = '/showcase';

/**
 * SHOWCASE_HEADER_SETTINGS_LABEL — задаёт `aria-label` шестерёнки шапки на витрине.
 * На остальных страницах Header подставляет свой дефолт.
 */
const SHOWCASE_HEADER_SETTINGS_LABEL = 'Header settings';

/**
 * DEFAULT_HEADER_PROFILE_MENU_TEXT — задаёт стартовые видимые тексты меню профиля.
 * Совпадает с умолчаниями `ProfileMenu`.
 */
const DEFAULT_HEADER_PROFILE_MENU_TEXT: HeaderProfileMenuText = {
  displayEmail: DEFAULT_PROFILE_MENU_EMAIL,
  greeting: DEFAULT_PROFILE_MENU_GREETING,
  privacyLabel: DEFAULT_PROFILE_MENU_PRIVACY_LABEL,
  profileLabel: DEFAULT_PROFILE_MENU_PROFILE_LABEL,
  signOutLabel: DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL,
  termsLabel: DEFAULT_PROFILE_MENU_TERMS_LABEL,
};

/**
 * resolveHeaderProfileMenu — возвращает пропы меню профиля для шапки.
 * Пустая строка в объект не входит: меню берёт своё умолчание.
 *
 * @param text видимые тексты из панели настроек
 * @returns пропы `ProfileMenu`
 */
function resolveHeaderProfileMenu(text: HeaderProfileMenuText): ProfileMenuProps {
  return {
    ...(text.displayEmail.trim() !== '' ? { displayEmail: text.displayEmail } : {}),
    ...(text.greeting.trim() !== '' ? { greeting: text.greeting } : {}),
    ...(text.privacyLabel.trim() !== '' ? { privacyLabel: text.privacyLabel } : {}),
    ...(text.profileLabel.trim() !== '' ? { profileLabel: text.profileLabel } : {}),
    ...(text.signOutLabel.trim() !== '' ? { signOutLabel: text.signOutLabel } : {}),
    ...(text.termsLabel.trim() !== '' ? { termsLabel: text.termsLabel } : {}),
  };
}

/**
 * RouterLayout — отображает каркас приложения с шапкой и outlet страниц.
 *
 * @example
 * <RouterLayout />
 */
export function RouterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoHide, setAutoHide] = useState(DEFAULT_HEADER_AUTO_HIDE);
  const [isHeaderSettingsOpen, setIsHeaderSettingsOpen] = useState(false);
  const [profileMenuText, setProfileMenuTextState] = useState(
    DEFAULT_HEADER_PROFILE_MENU_TEXT
  );

  const isShowcase = location.pathname === SHOWCASE_PATH;

  // Обвязка витрины: на витрине дизайн-системы шестерёнка открывает панель настроек шапки,
  // где в реальном времени виден autoHide. На остальных страницах ведёт на витрину.
  // На витрине у шестерёнки aria-controls на SHOWCASE_SIDEBAR_ID и aria-expanded
  // по открытости настроек шапки. На остальных страницах этих атрибутов нет.
  // Не переносить в продуктовый код: поведение шапки задаёт проп autoHide у Header, развилки витрины нет.
  /**
   * handleSettingsClick — открывает панель настроек шапки на витрине или переходит
   * на витрину с остальных страниц.
   */
  const handleSettingsClick = (): void => {
    if (isShowcase) {
      setIsHeaderSettingsOpen(true);
      return;
    }

    navigate(SHOWCASE_PATH);
  };

  const setProfileMenuText: ShellOutletContext['setProfileMenuText'] = (key, value) => {
    setProfileMenuTextState((current) => ({
      ...current,
      [key]: value,
    }));
  };
  const outletContext: ShellOutletContext = {
    autoHide,
    isHeaderSettingsOpen,
    profileMenuText,
    setAutoHide,
    setIsHeaderSettingsOpen,
    setProfileMenuText,
  };

  return (
    <>
      <Header
        autoHide={autoHide}
        profileMenu={resolveHeaderProfileMenu(profileMenuText)}
        settingsAriaControls={isShowcase ? SHOWCASE_SIDEBAR_ID : undefined}
        settingsAriaExpanded={isShowcase ? isHeaderSettingsOpen : undefined}
        settingsLabel={isShowcase ? SHOWCASE_HEADER_SETTINGS_LABEL : undefined}
        onSettingsClick={handleSettingsClick}
      />
      <Outlet context={outletContext} />
    </>
  );
}
