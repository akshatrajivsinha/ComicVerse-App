import { StyleSheet } from 'react-native';

interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
  text: string;
  backgroundCard: string;
  border: string;
  primaryBlue: string;
}

export const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    screenContainer: {
    flex: 1,
    backgroundColor: themeColors.backgroundCard,
  },
  headerBackground: {
    height: 300,
    width: '100%',
  },
  headerOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 20,
    color: themeColors.text,
    marginTop: 10,
  },
  profileName: {
    fontSize: 22,
    color:  '#FFF',
  },
  profileEmail:{
  fontSize: 12,
    color: '#FFF',
  },
  editIcon: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  container: {
    flex: 1,
    marginTop: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: themeColors.backgroundCard,
  },
  optionsContainer:{
    flex:1,
    position:'absolute',
    top:260,
    bottom:0,
    right:0,
    left:0,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingRowNoPadding: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 8,
  },
  settingColumn: {
    flexDirection: 'column',
    paddingTop: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowLabel: {
    fontSize: 16,
    color: themeColors.text,
    flex: 1,
  },
  arrowRight: {
    fontSize: 22,
    color: '#1A73E8',
  },
  rightValueText: {
    fontSize: 15,
    color: '#70757A',
  },
  logoutSideText: {
    fontSize: 15,
    color: '#5F6368',
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.border,
  },
  segmentSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 6,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  segmentText: {
    fontSize: 11,
    color: '#3C4043',
    marginLeft: 4,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BDC1C6',
  },
  radioDotActive: {
    backgroundColor: '#1A73E8',
  },
  languageDropdown: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  languageOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEF',
  },
  languageOptionLeft: {
    flexDirection: 'column',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#202124',
  },
  dropdownOptionSubtext: {
    fontSize: 11,
    color: '#70757A',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#BDC1C6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#1A73E8',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A73E8',
  },
  gradientOverlay: {
    flex: 1,
    width: '100%',
  },
  floatingAvatar: {
    position: 'absolute',
    top: -55,
    right: 155,
    width: 90,
    height: 90,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E1E1E1',
    zIndex: 10,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12
  },
  headerTitleText: {
    fontSize: 18,
    color: '#FFF',
  },
  topEditButton: {
    padding:10,
    backgroundColor: 'rgba(248, 242, 242, 0.84)',
    borderRadius: 100,
    borderColor: 'rgba(255, 255, 255, 0.99)',
  },
  profileRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  profileTextWrapper: {
    flex: 1,
    marginLeft: 15,
  },
  inlineAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E1E1E1',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: themeColors.backgroundCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: themeColors.textSlate,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: themeColors.text,
    marginBottom: 20,
  },
  modalSectionLabel: {
    fontSize: 12,
    color: themeColors.textSlate,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  modalImageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalCoverPreview: {
    width: 100,
    height: 56,
    borderRadius: 8,
    backgroundColor: themeColors.border,
    marginRight: 12,
  },
  modalAvatarPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: themeColors.border,
    marginRight: 12,
  },
  modalPickButton: {
    backgroundColor: themeColors.primaryBlue,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalPickButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  modalInput: {
    height: 46,
    backgroundColor: themeColors.backgroundDark,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: themeColors.text,
    borderWidth: 1,
    borderColor: themeColors.border,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    color: themeColors.textSlate,
  },
  modalSaveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: themeColors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 15,
    color: '#FFFFFF',
  },

  // Logout Modal
  logoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoutContainer: {
    backgroundColor: themeColors.backgroundCard,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
  },
  logoutIconRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,59,48,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 28,
  },
  logoutTitle: {
    fontSize: 20,
    color: themeColors.text,
    marginBottom: 8,
  },
  logoutMessage: {
    fontSize: 14,
    color: themeColors.textSlate,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  logoutButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  logoutCancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: themeColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutCancelText: {
    fontSize: 15,
    color: themeColors.textSlate,
  },
  logoutConfirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FF453A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutConfirmText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  });
