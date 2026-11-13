/**
 * Файл: `src/pages/showcase/header-settings/index.tsx`
 * Определяет панель настроек компонента Header в витрине дизайн-системы.
 * Содержит контролы для изменения приветствия, почты, текста профиля, текста выхода,
 * текста политики, текста условий и режима `autoHide` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `HeaderSettingsProps`
 * 2. Экспортировать компонент `HeaderSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с шапкой в каркасе страницы
 */

import {
  DEFAULT_PROFILE_MENU_EMAIL,
  DEFAULT_PROFILE_MENU_GREETING,
  DEFAULT_PROFILE_MENU_PRIVACY_LABEL,
  DEFAULT_PROFILE_MENU_PROFILE_LABEL,
  DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL,
  DEFAULT_PROFILE_MENU_TERMS_LABEL,
} from '@components/profile-menu';
import { type HeaderProfileMenuText } from '@components/router';
import { Switch } from '@ui/switch';

import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * HeaderSettingsProps — представляет пропсы компонента HeaderSettings.
 *
 * @property autoHide — включает режим скрытия шапки
 * @property onChange — обработчик изменения режима `autoHide`
 * @property onProfileMenuTextChange — меняет одно видимое поле меню профиля
 * @property profileMenuText — видимые тексты меню профиля
 */
type HeaderSettingsProps = {
  autoHide: boolean;
  onChange: (value: boolean) => void;
  onProfileMenuTextChange: <Key extends keyof HeaderProfileMenuText>(
    key: Key,
    value: HeaderProfileMenuText[Key]
  ) => void;
  profileMenuText: HeaderProfileMenuText;
};

/**
 * HeaderSettings — отображает панель настроек Header в витрине дизайн-системы.
 *
 * @example
 * <HeaderSettings
 *   autoHide={autoHide}
 *   profileMenuText={profileMenuText}
 *   onChange={setAutoHide}
 *   onProfileMenuTextChange={setProfileMenuText}
 * />
 */
export function HeaderSettings({
  autoHide,
  onChange,
  onProfileMenuTextChange,
  profileMenuText,
}: HeaderSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_PROFILE_MENU_GREETING,
            value: profileMenuText.greeting,
            onChange: (value) => onProfileMenuTextChange('greeting', value),
          },
        ]}
        labelPrefix="Greeting"
      />
      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_PROFILE_MENU_EMAIL,
            value: profileMenuText.displayEmail,
            onChange: (value) => onProfileMenuTextChange('displayEmail', value),
          },
        ]}
        labelPrefix="Email"
      />
      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_PROFILE_MENU_PROFILE_LABEL,
            value: profileMenuText.profileLabel,
            onChange: (value) => onProfileMenuTextChange('profileLabel', value),
          },
        ]}
        labelPrefix="Profile text"
      />
      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL,
            value: profileMenuText.signOutLabel,
            onChange: (value) => onProfileMenuTextChange('signOutLabel', value),
          },
        ]}
        labelPrefix="Sign out text"
      />
      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_PROFILE_MENU_PRIVACY_LABEL,
            value: profileMenuText.privacyLabel,
            onChange: (value) => onProfileMenuTextChange('privacyLabel', value),
          },
        ]}
        labelPrefix="Privacy text"
      />
      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_PROFILE_MENU_TERMS_LABEL,
            value: profileMenuText.termsLabel,
            onChange: (value) => onProfileMenuTextChange('termsLabel', value),
          },
        ]}
        labelPrefix="Terms text"
      />
      <Switch checked={autoHide} onChange={(event) => onChange(event.target.checked)}>
        Auto-hide
      </Switch>
    </StyledSettingsForm>
  );
}
