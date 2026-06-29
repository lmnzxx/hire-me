'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Download, Save, Clock } from 'lucide-react';
import { saveCurrentVersion, loadVersion } from '@/store/cvSlice';

// ponytail: No custom fonts to avoid async loading hell, just use built-in standard fonts.
const styles = StyleSheet.create({
  page: { 
    padding: 45, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #1E293B',
    paddingBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  name: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 4, 
    letterSpacing: 1,
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  targetRole: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  contactText: { 
    fontSize: 10, 
    color: '#64748B', 
    lineHeight: 1.5
  },
  section: { 
    marginTop: 20 
  },
  title: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    borderBottom: '1 solid #CBD5E1', 
    paddingBottom: 4, 
    marginBottom: 10, 
    color: '#1E293B', 
    textTransform: 'uppercase', 
    letterSpacing: 1.5 
  },
  text: { 
    lineHeight: 1.7, 
    color: '#334155',
    fontSize: 10.5
  },
  bold: { 
    fontWeight: 'bold', 
    color: '#0F172A' 
  },
});

const CVTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* HEADER: Identity */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.identity.name || 'Your Name'}</Text>
        <Text style={styles.targetRole}>{data.targetRole || 'Professional'}</Text>
        <Text style={styles.contactText}>{data.identity.emailOrPhone || 'Contact Info'}</Text>
      </View>

      {/* OBJECTIVE */}
      <View style={styles.section}>
        <Text style={styles.title}>Professional Summary</Text>
        <Text style={styles.text}>
          Driven and results-oriented professional transitioning into a <Text style={styles.bold}>{data.targetRole}</Text> position at <Text style={styles.bold}>{data.targetCompany}</Text>. Combining analytical acumen with proven adaptability to deliver impactful solutions. Eager to leverage transferable skills and a track record of operational excellence to drive innovation.
        </Text>
      </View>

      {/* ACHIEVEMENTS */}
      <View style={styles.section}>
        <Text style={styles.title}>Key Achievements</Text>
        <Text style={styles.text}>{data.coreAchievements}</Text>
      </View>

      {/* EXPERIENCE */}
      <View style={styles.section}>
        <Text style={styles.title}>Professional Experience & Skills</Text>
        <Text style={styles.text}>{data.workHistory}</Text>
      </View>

    </Page>
  </Document>
);

export default function CVDownload() {
  const cvData = useSelector((state: RootState) => state.cv);
  const dispatch = useDispatch();
  
  if (!cvData.isComplete) return null;

  return (
    <div className="mt-12 p-8 border dark:border-gray-800 rounded-3xl bg-white dark:bg-black/40 text-center shadow-xl backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
        <Download size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-2">Your CV is Ready</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">We've structured your experience into a clean, ATS-optimized layout.</p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <PDFDownloadLink
          document={<CVTemplate data={cvData} />}
          fileName={`${cvData.identity.name.replace(/\\s+/g, '_')}_CV.pdf`}
          className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl w-full sm:w-auto"
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download CV')}
        </PDFDownloadLink>
        
        <button 
          onClick={() => dispatch(saveCurrentVersion())}
          className="inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md w-full sm:w-auto"
        >
          <Save size={18} /> Save Version
        </button>
      </div>

      {cvData.versions && cvData.versions.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-left">
          <h4 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Clock size={16} /> Saved Versions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cvData.versions.map((v: any, i: number) => (
              <button 
                key={v.id} 
                onClick={() => dispatch(loadVersion(v.id))}
                className="flex flex-col p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all text-left group"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Version {i + 1}: {v.targetRole}
                </span>
                <span className="text-xs text-gray-500 mt-1">{v.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
