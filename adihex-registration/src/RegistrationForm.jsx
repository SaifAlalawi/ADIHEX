import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CalendarDays, User, Hash } from "lucide-react";

const arabicMonths = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];

const arabicWeekdays = [
  "الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"
];

function formatArabicDate(d) {
  const date = new Date(d);
  const weekday = arabicWeekdays[(date.getDay() + 6) % 7];
  const day = date.getDate();
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

function buildEventDays() {
  const start = new Date("2025-08-30");
  const end = new Date("2025-09-07");
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    days.push({ id: iso, label: formatArabicDate(iso) });
  }
  return days;
}

const daysList = buildEventDays();

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [allDays, setAllDays] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const eventRangeLabel = useMemo(() => {
    const start = "السبت 30 أغسطس 2025";
    const end = "الأحد 7 سبتمبر 2025";
    return `${start} — ${end}`;
  }, []);

  const toggleDay = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!uid.trim()) e.uid = "الرقم الجامعي مطلوب";
    if (!allDays && selectedDays.length === 0) e.days = "اختر يومًا واحدًا على الأقل أو جميع الأيام";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const daysToSave = allDays ? daysList.map((d) => d.id) : selectedDays;

    try {
      const prev = JSON.parse(localStorage.getItem("adife_2025_regs") || "[]");
      prev.push({ name, uid, selectedDays: daysToSave, timestamp: new Date().toISOString() });
      localStorage.setItem("adife_2025_regs", JSON.stringify(prev));
    } catch {}

    setSelectedDays(daysToSave);
    setSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setUid("");
    setSelectedDays([]);
    setAllDays(false);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                تسجيل حضور — معرض أبوظبي للصيد والفروسية 2025
              </h1>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <CalendarDays className="w-5 h-5" />
                <span>{eventRangeLabel}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 space-y-6"
                >
                  {/* انسخ باقي الكود الخاص بالنموذج كما هو */}
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6"
                >
                  {/* رسالة النجاح */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
            مواعيد المعرض بالتفصيل:
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
              {daysList.map((d) => (
                <div key={d.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}