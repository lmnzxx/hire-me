import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CVIdentity {
  name: string;
  emailOrPhone: string;
}

export interface CVState {
  targetRole: string;
  targetCompany: string;
  workHistory: string;
  coreAchievements: string;
  identity: CVIdentity;
  isComplete: boolean;
  versions: Array<any>;
}

const initialState: CVState = {
  targetRole: '',
  targetCompany: '',
  workHistory: '',
  coreAchievements: '',
  identity: {
    name: '',
    emailOrPhone: '',
  },
  isComplete: false,
  versions: [],
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updateCVData(state, action: PayloadAction<any>) {
      const payload = action.payload;
      
      const findVal = (obj: any, keys: string[]) => {
        if (!obj) return undefined;
        for (const key of keys) {
          const exact = obj[key];
          if (exact !== undefined) return exact;
          const foundKey = Object.keys(obj).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, ''));
          if (foundKey) return obj[foundKey];
        }
        return undefined;
      };

      const tRole = findVal(payload, ['targetRole', 'role', 'position']);
      const tComp = findVal(payload, ['targetCompany', 'company']);
      const wHist = findVal(payload, ['workHistory', 'experience', 'history']);
      const cAch = findVal(payload, ['coreAchievements', 'achievements']);
      
      const identityObj = payload.identity || payload.Identity || payload;
      const iName = findVal(identityObj, ['name', 'fullname']);
      const iContact = findVal(identityObj, ['emailOrPhone', 'contact', 'email', 'phone']);

      if (tRole) state.targetRole = tRole;
      if (tComp) state.targetCompany = tComp;
      if (wHist) state.workHistory = wHist;
      if (cAch) state.coreAchievements = cAch;
      if (iName) state.identity.name = iName;
      if (iContact) state.identity.emailOrPhone = iContact;
      
      state.isComplete = !!(state.targetRole || state.workHistory || state.coreAchievements || state.identity.name);
    },
    saveCurrentVersion(state) {
      if (state.isComplete) {
        if (!state.versions) {
          state.versions = [];
        }
        state.versions.push({
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          targetRole: state.targetRole,
          targetCompany: state.targetCompany,
          workHistory: state.workHistory,
          coreAchievements: state.coreAchievements,
          identity: { ...state.identity }
        });
      }
    },
    loadVersion(state, action: PayloadAction<string>) {
      if (!state.versions) return;
      const version = state.versions.find(v => v.id === action.payload);
      if (version) {
        state.targetRole = version.targetRole;
        state.targetCompany = version.targetCompany;
        state.workHistory = version.workHistory;
        state.coreAchievements = version.coreAchievements;
        state.identity = { ...version.identity };
      }
    },
    resetCV(state) {
      return { ...initialState, versions: state.versions };
    }
  },
});

export const { updateCVData, saveCurrentVersion, loadVersion, resetCV } = cvSlice.actions;
export default cvSlice.reducer;
