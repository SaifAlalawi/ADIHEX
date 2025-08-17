import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CalendarDays, User, Hash } from "lucide-react";

// helper: Arabic date formatting
const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const arabicWeekdays = [
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
  "الأحد",
];

function formatArabicDate(d) {
  const date = new Date(d);
  const weekday = arabicWeekdays[(date.getDay() + 6) % 7]; // convert JS Sun=0 to Mon=0
  const day = date.getDate();
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

// Build days from 2025-08-30 to 2025-09-07 inclusive
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
    if (selectedDays.length === 0) e.days = "اختر يومًا واحدًا على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Store locally (اختياري)
    try {
      const prev = JSON.parse(localStorage.getItem("adife_2025_regs") || "[]");
      prev.push({ name, uid, selectedDays, timestamp: new Date().toISOString() });
      localStorage.setItem("adife_2025_regs", JSON.stringify(prev));
    } catch {}

    setSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setUid("");
    setSelectedDays([]);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
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

            <p className="mt-3 text-slate-600 leading-relaxed">
              الرجاء تعبئة البيانات التالية واختيار الأيام التي تود حضورها. هذا النموذج
              مخصص لطلبة الجامعة فقط.
            </p>

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        الاسم الكامل
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="اكتب اسمك هنا"
                          className={`w-full pl-10 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-400 transition ${
                            errors.name ? "border-rose-400" : "border-slate-300"
                          }`}
                          dir="rtl"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-rose-600 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        الرقم الجامعي
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={uid}
                          onChange={(e) => setUid(e.target.value.replace(/\s+/g, ""))}
                          placeholder="مثال: 202012345"
                          className={`w-full pl-10 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-600/20 focus:border-slate-400 transition ${
                            errors.uid ? "border-rose-400" : "border-slate-300"
                          }`}
                          dir="ltr"
                          inputMode="numeric"
                        />
                      </div>
                      {errors.uid && (
                        <p className="text-rose-600 text-sm mt-1">{errors.uid}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      اختر الأيام التي ستحضرها
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {daysList.map((d) => (
                        <label
                          key={d.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition hover:shadow-sm ${
                            selectedDays.includes(d.id)
                              ? "border-slate-700 bg-slate-50"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          <div className="text-slate-800 font-medium" dir="rtl">
                            {d.label}
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(d.id)}
                            onChange={() => toggleDay(d.id)}
                            className="w-5 h-5 accent-slate-700"
                          />
                        </label>
                      ))}
                    </div>
                    {errors.days && (
                      <p className="text-rose-600 text-sm mt-2">{errors.days}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                    >
                      مسح البيانات
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-semibold shadow hover:shadow-md hover:bg-slate-900 transition"
                    >
                      تسجيل
                    </button>
                  </div>
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
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-green-700 mt-0.5" />
                    <div className="text-slate-800" dir="rtl">
                      <p className="text-lg font-bold">شكرًا لتسجيلك!</p>
                      <p className="mt-1">
                        أهلًا وسهلًا بك يا <span className="font-semibold">{name}</span>. تم حفظ تسجيلك لحضور معرض
                        أبوظبي للصيد والفروسية 2025 في الأيام التالية:
                      </p>
                      <ul className="list-disc pr-6 mt-2 space-y-1">
                        {selectedDays
                          .slice()
                          .sort()
                          .map((id) => (
                            <li key={id}>{formatArabicDate(id)}</li>
                          ))}
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        رقمك الجامعي: {uid}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={resetForm}
                          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                        >
                          تسجيل جديد
                        </button>
                        <button
                          onClick={() => (window.location.href = window.location.href)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold shadow hover:shadow-md hover:bg-slate-900 transition"
                        >
                          إنهاء
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-600" dir="rtl">
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
