import ArrowDown from './ArrowDown';
import ArrowNext from './ArrowNext';
import ArrowPrev from './ArrowPrev';
import ArrowUp from './ArrowUp';
import IcAvatar from './IcAvatar';
import IcBell from './IcBell';
import IcCalendar from './IcCalendar';
import IcCalendarAdd from './IcCalendarAdd';
import IcCheck from './IcCheck';
import IcCheckboxChecked from './IcCheckboxChecked';
import IcCheckboxDefault from './IcCheckboxDefault';
import IcCircleCheckFilled from './IcCircleCheckFilled';
import IcCircleCheckOutline from './IcCircleCheckOutline';
import IcCircleXFilled from './IcCircleXFilled';
import IcCircleXOutline from './IcCircleXOutline';
import IcClipboard from './IcClipboard';
import IcFlame from './IcFlame';
import IcGoogle from './IcGoogle';
import IcHamburger from './IcHamburger';
import IcHome from './IcHome';
import IcInfoFilled from './IcInfoFilled';
import IcInfoOutline from './IcInfoOutline';
import IcKakao from './IcKakao';
import IcLetter from './IcLetter';
import IcLicense from './IcLicense';
import IcLogout from './IcLogout';
import IcMagic from './IcMagic';
import IcMenuClose from './IcMenuClose';
import IcMinus from './IcMinus';
import IcOtherShare from './IcOtherShare';
import IcPencil from './IcPencil';
import IcPeople from './IcPeople';
import IcPlus from './IcPlus';
import IcRefresh from './IcRefresh';
import IcSave from './IcSave';

export const icons = {
  arrow_down: ArrowDown,
  arrow_next: ArrowNext,
  arrow_prev: ArrowPrev,
  arrow_up: ArrowUp,
  ic_avatar: IcAvatar,
  ic_bell: IcBell,
  ic_calendar: IcCalendar,
  ic_calendar_add: IcCalendarAdd,
  ic_check: IcCheck,
  ic_checkbox_checked: IcCheckboxChecked,
  ic_checkbox_default: IcCheckboxDefault,
  ic_circle_check_filled: IcCircleCheckFilled,
  ic_circle_check_outline: IcCircleCheckOutline,
  ic_circle_x_filled: IcCircleXFilled,
  ic_circle_x_outline: IcCircleXOutline,
  ic_clipboard: IcClipboard,
  ic_flame: IcFlame,
  ic_google: IcGoogle,
  ic_hamburger: IcHamburger,
  ic_home: IcHome,
  ic_info_filled: IcInfoFilled,
  ic_info_outline: IcInfoOutline,
  ic_kakao: IcKakao,
  ic_letter: IcLetter,
  ic_license: IcLicense,
  ic_logout: IcLogout,
  ic_magic: IcMagic,
  ic_menu_close: IcMenuClose,
  ic_minus: IcMinus,
  ic_other_share: IcOtherShare,
  ic_pencil: IcPencil,
  ic_people: IcPeople,
  ic_plus: IcPlus,
  ic_refresh: IcRefresh,
  ic_save: IcSave,
} as const;

export type IconName = keyof typeof icons;
