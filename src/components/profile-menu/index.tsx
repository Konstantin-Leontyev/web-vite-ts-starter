/**
 * Файл: `src/components/profile-menu/index.tsx`
 * Предоставляет компонент ProfileMenu для отображения меню профиля в шапке.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - видимое приветствие через проп `greeting`. Без пропа — `Hello, User!`.
 *    Пустая строка прячет текст, имя диалога остаётся этой фразой
 *  - видимый текст действия профиля через проп `profileLabel`. Без пропа — `Profile`.
 *    Пустая строка прячет текст, имя кнопки остаётся этой фразой
 *  - видимый текст действия выхода через проп `signOutLabel`. Без пропа — `Sign out`.
 *    Пустая строка прячет текст, имя кнопки остаётся этой фразой
 *  - видимый текст ссылки политики через проп `privacyLabel`. Без пропа —
 *    `Privacy Policy`. Пустая строка прячет текст, имя ссылки остаётся этой фразой
 *  - видимый текст ссылки условий через проп `termsLabel`. Без пропа —
 *    `Terms of Service`. Пустая строка прячет текст, имя ссылки остаётся этой фразой
 *  - почту в шапке панели через проп `displayEmail`. Без пропа — `user@example.com`.
 *    Пустая строка убирает подзаголовок и подсказку триггера
 *  - доступное имя кнопки меню через проп `triggerAriaLabel`. Без пропа —
 *    `Profile menu for User`. Пустая строка остаётся этой фразой
 *  - доступное имя кнопки закрытия через проп `closeAriaLabel`. Без пропа —
 *    `Close profile menu`. Пустая строка остаётся этой фразой
 *  - доступное имя навигации правовых ссылок через проп `legalAriaLabel`. Без пропа —
 *    `Legal`. Пустая строка остаётся этой фразой
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProfileMenu
 * 2. Типизировать пропсы через `ProfileMenuProps`
 * 3. Выставлять `role` и `aria`-атрибуты панели и триггера.
 *    Фокус при открытии — на сегмент Profile: первое содержательное действие
 *    текущей разметки
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — рендерит меню профиля в шапке
 */

import {
  Fragment,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { AddCircleIcon, AvatarIcon, CloseIcon, SignOutIcon } from '@icons';
import { AnchoredPanel } from '@ui/anchored-panel';
import { Icon } from '@ui/icon';
import { SegmentButton } from '@ui/segment-button';
import { getSpacingValue } from '@ui/spacing';
import { Text } from '@ui/text';

import {
  StyledProfileMenu,
  StyledProfileMenuContent,
  StyledProfileMenuHeader,
  StyledProfileMenuLegal,
  StyledProfileMenuLegalLink,
  StyledProfileMenuPanel,
  type ProfileMenuStyleProps,
} from './profile-menu.styles';

/**
 * DEFAULT_PROFILE_MENU_EMAIL — задаёт почту в шапке панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `displayEmail`.
 */
const DEFAULT_PROFILE_MENU_EMAIL = 'user@example.com';

/**
 * DEFAULT_PROFILE_MENU_TRIGGER_ARIA_LABEL — задаёт доступное имя кнопки меню по умолчанию.
 * Используется, когда вызывающий код не передал проп `triggerAriaLabel`.
 */
const DEFAULT_PROFILE_MENU_TRIGGER_ARIA_LABEL = 'Profile menu for User';

/**
 * DEFAULT_PROFILE_MENU_CLOSE_ARIA_LABEL — задаёт доступное имя кнопки закрытия панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `closeAriaLabel`.
 */
const DEFAULT_PROFILE_MENU_CLOSE_ARIA_LABEL = 'Close profile menu';

/**
 * DEFAULT_PROFILE_MENU_GREETING — задаёт видимое приветствие панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `greeting`.
 */
const DEFAULT_PROFILE_MENU_GREETING = 'Hello, User!';

/**
 * DEFAULT_PROFILE_MENU_PROFILE_LABEL — задаёт видимый текст действия профиля по умолчанию.
 * Используется, когда вызывающий код не передал проп `profileLabel`.
 */
const DEFAULT_PROFILE_MENU_PROFILE_LABEL = 'Profile';

/**
 * DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL — задаёт видимый текст действия выхода по умолчанию.
 * Используется, когда вызывающий код не передал проп `signOutLabel`.
 */
const DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL = 'Sign out';

/**
 * PROFILE_MENU_CLOSE_ICON_PADDING — задаёт отступ окна Icon у кнопки закрытия.
 */
const PROFILE_MENU_CLOSE_ICON_PADDING = 12;

/**
 * PROFILE_MENU_AVATAR_PADDING — задаёт отступ окна Icon аватара в шапке панели.
 */
const PROFILE_MENU_AVATAR_PADDING = 8;

/**
 * PROFILE_MENU_ACTIONS_PADDING_INLINE — задаёт боковой отступ ряда SegmentButton.
 */
const PROFILE_MENU_ACTIONS_PADDING_INLINE = 4;

/**
 * PROFILE_MENU_ACTIONS_MARGIN_BLOCK_START — задаёт отступ ряда действий от шапки.
 */
const PROFILE_MENU_ACTIONS_MARGIN_BLOCK_START = 12;

/**
 * DEFAULT_PROFILE_MENU_LEGAL_ARIA_LABEL — задаёт доступное имя навигации правовых ссылок по умолчанию.
 * Используется, когда вызывающий код не передал проп `legalAriaLabel`.
 */
const DEFAULT_PROFILE_MENU_LEGAL_ARIA_LABEL = 'Legal';

/**
 * DEFAULT_PROFILE_MENU_PRIVACY_LABEL — задаёт видимый текст ссылки политики по умолчанию.
 * Используется, когда вызывающий код не передал проп `privacyLabel`.
 */
const DEFAULT_PROFILE_MENU_PRIVACY_LABEL = 'Privacy Policy';

/**
 * DEFAULT_PROFILE_MENU_TERMS_LABEL — задаёт видимый текст ссылки условий по умолчанию.
 * Используется, когда вызывающий код не передал проп `termsLabel`.
 */
const DEFAULT_PROFILE_MENU_TERMS_LABEL = 'Terms of Service';

/**
 * PROFILE_MENU_LEGAL_PATHS — задаёт адреса правовых ссылок меню профиля.
 */
const PROFILE_MENU_LEGAL_PATHS = [
  { key: 'privacy', to: '/privacy' },
  { key: 'terms', to: '/terms' },
] as const;

/**
 * PROFILE_MENU_PANEL_MIN_INLINE_SIZE_PX — задаёт минимальную ширину панели меню профиля в px.
 * Используется в `PROFILE_MENU_INLINE_SIZE`.
 */
const PROFILE_MENU_PANEL_MIN_INLINE_SIZE_PX = 360;

/**
 * PROFILE_MENU_VIEWPORT_INLINE_GUTTER — задаёт суммарный горизонтальный зазор панели
 * от краёв вьюпорта по `32` с каждой стороны.
 * Используется в `PROFILE_MENU_MAX_INLINE_SIZE`.
 */
const PROFILE_MENU_VIEWPORT_INLINE_GUTTER = `calc(${getSpacingValue(32)} * 2)`;

/**
 * PROFILE_MENU_MAX_INLINE_SIZE — задаёт максимальную ширину панели меню профиля:
 * вьюпорт минус зазор по обеим сторонам.
 * Используется в `maxInlineSize` Card панели ProfileMenu и внутри `PROFILE_MENU_INLINE_SIZE`.
 */
const PROFILE_MENU_MAX_INLINE_SIZE = `calc(100vw - ${PROFILE_MENU_VIEWPORT_INLINE_GUTTER})`;

/**
 * PROFILE_MENU_INLINE_SIZE — задаёт минимальную ширину панели меню профиля.
 * Используется в `minInlineSize` Card панели ProfileMenu.
 */
const PROFILE_MENU_INLINE_SIZE = `min(${PROFILE_MENU_PANEL_MIN_INLINE_SIZE_PX}px, ${PROFILE_MENU_MAX_INLINE_SIZE})`;

/**
 * ProfileMenuProps — представляет пропсы компонента ProfileMenu.
 *
 * @property closeAriaLabel — доступное имя кнопки закрытия. Без пропа —
 *   `Close profile menu`. Пустая строка остаётся этой фразой
 * @property displayEmail — почта в шапке панели. Без пропа — `user@example.com`.
 *   Пустая строка убирает подзаголовок и подсказку триггера
 * @property greeting — видимое приветствие. Без пропа — `Hello, User!`.
 *   Пустая строка прячет текст, имя диалога остаётся этой фразой
 * @property legalAriaLabel — доступное имя навигации правовых ссылок. Без пропа —
 *   `Legal`. Пустая строка остаётся этой фразой
 * @property privacyLabel — видимый текст ссылки политики. Без пропа — `Privacy Policy`.
 *   Пустая строка прячет текст, имя ссылки остаётся этой фразой
 * @property profileLabel — видимый текст действия профиля. Без пропа — `Profile`.
 *   Пустая строка прячет текст, имя кнопки остаётся этой фразой
 * @property signOutLabel — видимый текст действия выхода. Без пропа — `Sign out`.
 *   Пустая строка прячет текст, имя кнопки остаётся этой фразой
 * @property termsLabel — видимый текст ссылки условий. Без пропа — `Terms of Service`.
 *   Пустая строка прячет текст, имя ссылки остаётся этой фразой
 * @property triggerAriaLabel — доступное имя кнопки меню. Без пропа —
 *   `Profile menu for User`. Пустая строка остаётся этой фразой
 */
type ProfileMenuProps = ProfileMenuStyleProps & {
  closeAriaLabel?: string;
  displayEmail?: string;
  greeting?: string;
  legalAriaLabel?: string;
  privacyLabel?: string;
  profileLabel?: string;
  signOutLabel?: string;
  termsLabel?: string;
  triggerAriaLabel?: string;
} & Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof ProfileMenuStyleProps
  >;

/**
 * resolveProfilePhrase — возвращает целую фразу имени.
 * Пустая строка или пробелы остаются умолчанием.
 *
 * @param value переданный текст
 * @param fallback умолчание фразы
 * @returns фраза имени
 */
function resolveProfilePhrase(value: string | undefined, fallback: string): string {
  if (value !== undefined && value.trim() !== '') {
    return value;
  }

  return fallback;
}

/**
 * resolveVisiblePhrase — возвращает видимый текст.
 * Без пропа — умолчание. Пустая строка или пробелы — текста нет.
 *
 * @param value переданный текст
 * @param fallback умолчание видимого текста
 * @returns видимый текст или `undefined`
 */
function resolveVisiblePhrase(
  value: string | undefined,
  fallback: string
): string | undefined {
  if (value === undefined) {
    return fallback;
  }

  if (value.trim() === '') {
    return undefined;
  }

  return value;
}

/**
 * resolveSegmentLabel — возвращает видимый текст сегмента и имя без текста.
 * Пустая строка прячет текст. Имя кнопки тогда — умолчание.
 *
 * @param value переданный текст
 * @param fallback умолчание сегмента
 * @returns подпись и доступное имя пустой кнопки
 */
function resolveSegmentLabel(
  value: string | undefined,
  fallback: string
): { ariaLabel?: string; label: string } {
  const visible = resolveVisiblePhrase(value, fallback);

  if (visible === undefined) {
    return { ariaLabel: fallback, label: '' };
  }

  return { label: visible };
}

/**
 * ProfileMenu — отображает меню профиля с аватаром, действиями и правовыми ссылками.
 *
 * @example
 * <ProfileMenu />
 */
function ProfileMenu({
  closeAriaLabel,
  displayEmail,
  greeting,
  legalAriaLabel,
  privacyLabel,
  profileLabel,
  signOutLabel,
  termsLabel,
  triggerAriaLabel,
  ...props
}: ProfileMenuProps) {
  const { handleClose, handleOpen, handleToggle, isOpen, panelRef } =
    useAnchoredOpen<HTMLDivElement>();
  const menuId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const profileActionRef = useRef<HTMLButtonElement>(null);
  const emailText = resolveVisiblePhrase(displayEmail, DEFAULT_PROFILE_MENU_EMAIL);
  const greetingText = resolveVisiblePhrase(greeting, DEFAULT_PROFILE_MENU_GREETING);
  const privacyText = resolveVisiblePhrase(
    privacyLabel,
    DEFAULT_PROFILE_MENU_PRIVACY_LABEL
  );
  const termsText = resolveVisiblePhrase(termsLabel, DEFAULT_PROFILE_MENU_TERMS_LABEL);
  const legalLinks = [
    {
      name: DEFAULT_PROFILE_MENU_PRIVACY_LABEL,
      text: privacyText,
      to: PROFILE_MENU_LEGAL_PATHS[0].to,
    },
    {
      name: DEFAULT_PROFILE_MENU_TERMS_LABEL,
      text: termsText,
      to: PROFILE_MENU_LEGAL_PATHS[1].to,
    },
  ] as const;
  const subtitleProps =
    emailText === undefined
      ? {}
      : { subtitle: emailText, subtitleAlign: 'center' as const };

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      handleOpen();
    }
  }

  function handleOpenFocus(): void {
    profileActionRef.current?.focus();
  }

  return (
    <StyledProfileMenu {...props}>
      <Icon
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={resolveProfilePhrase(
          triggerAriaLabel,
          DEFAULT_PROFILE_MENU_TRIGGER_ARIA_LABEL
        )}
        as="button"
        ref={triggerRef}
        shape="round"
        title={emailText}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
      >
        <AvatarIcon />
      </Icon>

      <AnchoredPanel
        anchorRef={triggerRef}
        dismissZoneRefs={[triggerRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={handleOpenFocus}
      >
        <StyledProfileMenuPanel
          aria-label={
            greetingText === undefined ? DEFAULT_PROFILE_MENU_GREETING : undefined
          }
          aria-labelledby={greetingText === undefined ? undefined : titleId}
          aria-modal={true}
          headerActions={[
            {
              ariaLabel: resolveProfilePhrase(
                closeAriaLabel,
                DEFAULT_PROFILE_MENU_CLOSE_ARIA_LABEL
              ),
              icon: <CloseIcon />,
              iconPadding: PROFILE_MENU_CLOSE_ICON_PADDING,
              onClick: handleClose,
            },
          ]}
          id={menuId}
          maxInlineSize={PROFILE_MENU_MAX_INLINE_SIZE}
          minBlockSize="0"
          minInlineSize={PROFILE_MENU_INLINE_SIZE}
          position="fixed"
          ref={panelRef}
          role="dialog"
          {...subtitleProps}
        >
          <StyledProfileMenuContent>
            <StyledProfileMenuHeader>
              <Icon
                aria-hidden="true"
                blockSize={getSpacingValue(80)}
                inlineSize={getSpacingValue(80)}
                padding={PROFILE_MENU_AVATAR_PADDING}
                shape="round"
                showBorder
              >
                <AvatarIcon />
              </Icon>
              {greetingText !== undefined && (
                <Text align="center" as="p" id={titleId} size="extraBold">
                  {greetingText}
                </Text>
              )}
            </StyledProfileMenuHeader>

            <SegmentButton
              left={{
                ...resolveSegmentLabel(profileLabel, DEFAULT_PROFILE_MENU_PROFILE_LABEL),
                icon: <AddCircleIcon />,
                iconFill: 'primary',
                iconPosition: 'start',
                ref: profileActionRef,
                onClick: handleClose,
              }}
              marginBlockStart={PROFILE_MENU_ACTIONS_MARGIN_BLOCK_START}
              paddingInline={PROFILE_MENU_ACTIONS_PADDING_INLINE}
              right={{
                ...resolveSegmentLabel(
                  signOutLabel,
                  DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL
                ),
                icon: <SignOutIcon />,
                onClick: handleClose,
              }}
              shape="pill"
            />

            <StyledProfileMenuLegal
              aria-label={resolveProfilePhrase(
                legalAriaLabel,
                DEFAULT_PROFILE_MENU_LEGAL_ARIA_LABEL
              )}
            >
              {legalLinks.map((link, index) => {
                const previous = legalLinks[index - 1];
                const showSeparator =
                  previous !== undefined &&
                  previous.text !== undefined &&
                  link.text !== undefined;

                return (
                  <Fragment key={link.to}>
                    {showSeparator && (
                      <Text aria-hidden="true" tone="muted">
                        ·
                      </Text>
                    )}
                    <StyledProfileMenuLegalLink
                      aria-label={link.text === undefined ? link.name : undefined}
                      to={link.to}
                      onClick={handleClose}
                    >
                      {link.text !== undefined && (
                        <Text align="center" size="thin">
                          {link.text}
                        </Text>
                      )}
                    </StyledProfileMenuLegalLink>
                  </Fragment>
                );
              })}
            </StyledProfileMenuLegal>
          </StyledProfileMenuContent>
        </StyledProfileMenuPanel>
      </AnchoredPanel>
    </StyledProfileMenu>
  );
}

export {
  DEFAULT_PROFILE_MENU_EMAIL,
  DEFAULT_PROFILE_MENU_GREETING,
  DEFAULT_PROFILE_MENU_PRIVACY_LABEL,
  DEFAULT_PROFILE_MENU_PROFILE_LABEL,
  DEFAULT_PROFILE_MENU_SIGN_OUT_LABEL,
  DEFAULT_PROFILE_MENU_TERMS_LABEL,
  ProfileMenu,
  type ProfileMenuProps,
};
