/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { createTheme } from "@mui/material/styles";
// import Fade from "@mui/material/Fade";

// Material Kit 2 React base styles
import colors from "@mk_assets/theme/base/colors";
import breakpoints from "@mk_assets/theme/base/breakpoints";
import typography from "@mk_assets/theme/base/typography";
import boxShadows from "@mk_assets/theme/base/boxShadows";
import borders from "@mk_assets/theme/base/borders";
import globals from "@mk_assets/theme/base/globals";
import * as functions from "./functions"; // 导入所有函数

// Material Kit 2 React helper functions
import boxShadow from "@mk_assets/theme/functions/boxShadow";
import hexToRgb from "@mk_assets/theme/functions/hexToRgb";
import linearGradient from "@mk_assets/theme/functions/linearGradient";
import pxToRem from "@mk_assets/theme/functions/pxToRem";
import rgba from "@mk_assets/theme/functions/rgba";

// Material Kit 2 React components base styles for @mui material components
import list from "@mk_assets/theme/components/list";
import listItem from "@mk_assets/theme/components/list/listItem";
import listItemText from "@mk_assets/theme/components/list/listItemText";
import card from "@mk_assets/theme/components/card";
import cardMedia from "@mk_assets/theme/components/card/cardMedia";
import cardContent from "@mk_assets/theme/components/card/cardContent";
import button from "@mk_assets/theme/components/button";
import iconButton from "@mk_assets/theme/components/iconButton";
import input from "@mk_assets/theme/components/form/input";
import inputLabel from "@mk_assets/theme/components/form/inputLabel";
import inputOutlined from "@mk_assets/theme/components/form/inputOutlined";
import textField from "@mk_assets/theme/components/form/textField";
import menu from "@mk_assets/theme/components/menu";
import menuItem from "@mk_assets/theme/components/menu/menuItem";
import switchButton from "@mk_assets/theme/components/form/switchButton";
import divider from "@mk_assets/theme/components/divider";
import tableContainer from "@mk_assets/theme/components/table/tableContainer";
import tableHead from "@mk_assets/theme/components/table/tableHead";
import tableCell from "@mk_assets/theme/components/table/tableCell";
import linearProgress from "@mk_assets/theme/components/linearProgress";
import breadcrumbs from "@mk_assets/theme/components/breadcrumbs";
import slider from "@mk_assets/theme/components/slider";
import avatar from "@mk_assets/theme/components/avatar";
import tooltip from "@mk_assets/theme/components/tooltip";
import appBar from "@mk_assets/theme/components/appBar";
import tabs from "@mk_assets/theme/components/tabs";
import tab from "@mk_assets/theme/components/tabs/tab";
import stepper from "@mk_assets/theme/components/stepper";
import step from "@mk_assets/theme/components/stepper/step";
import stepConnector from "@mk_assets/theme/components/stepper/stepConnector";
import stepLabel from "@mk_assets/theme/components/stepper/stepLabel";
import stepIcon from "@mk_assets/theme/components/stepper/stepIcon";
import select from "@mk_assets/theme/components/form/select";
import formControlLabel from "@mk_assets/theme/components/form/formControlLabel";
import formLabel from "@mk_assets/theme/components/form/formLabel";
import checkbox from "@mk_assets/theme/components/form/checkbox";
import radio from "@mk_assets/theme/components/form/radio";
import autocomplete from "@mk_assets/theme/components/form/autocomplete";
import flatpickr from "@mk_assets/theme/components/flatpickr";
import container from "@mk_assets/theme/components/container";
import popover from "@mk_assets/theme/components/popover";
import buttonBase from "@mk_assets/theme/components/buttonBase";
import icon from "@mk_assets/theme/components/icon";
import svgIcon from "@mk_assets/theme/components/svgIcon";
import link from "@mk_assets/theme/components/link";
import dialog from "@mk_assets/theme/components/dialog";
import dialogTitle from "@mk_assets/theme/components/dialog/dialogTitle";
import dialogContent from "@mk_assets/theme/components/dialog/dialogContent";
import dialogContentText from "@mk_assets/theme/components/dialog/dialogContentText";
import dialogActions from "@mk_assets/theme/components/dialog/dialogActions";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...flatpickr,
        ...container,
      },
    },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiInput: { ...input },
    MuiInputLabel: { ...inputLabel },
    MuiOutlinedInput: { ...inputOutlined },
    MuiTextField: { ...textField },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiSwitch: { ...switchButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiStepper: { ...stepper },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepLabel: { ...stepLabel },
    MuiStepIcon: { ...stepIcon },
    MuiSelect: { ...select },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiCheckbox: { ...checkbox },
    MuiRadio: { ...radio },
    MuiAutocomplete: { ...autocomplete },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
    MuiDialog: { ...dialog },
    MuiDialogTitle: { ...dialogTitle },
    MuiDialogContent: { ...dialogContent },
    MuiDialogContentText: { ...dialogContentText },
    MuiDialogActions: { ...dialogActions },
  },
});
