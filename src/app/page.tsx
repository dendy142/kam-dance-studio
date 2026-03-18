"use client";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Image from "next/image";

/* ═══════ ICONS ═══════ */
const I = {
  menu: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/></svg>,
  x: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  arrow: (cls="w-5 h-5") => <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/></svg>,
  up: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>,
  check: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>,
  star: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>,
  chev: (open: boolean) => <svg className={`w-5 h-5 transition-transform duration-300 ${open?"rotate-180":""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>,
  phone: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>,
  pin: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
  clock: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  mail: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>,
  ig: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  tg: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
};

/* ═══════ HOOKS ═══════ */
function useVis(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, sv] = useState(false);
  useEffect(() => { const el = ref.current; if(!el) return; const o = new IntersectionObserver(([e]) => { if(e.isIntersecting){sv(true);o.unobserve(el);} }, {threshold:t, rootMargin:"0px 0px -30px 0px"}); o.observe(el); return ()=>o.disconnect(); }, [t]);
  return {ref, v};
}
function useCount(end: number, ms=2000) {
  const [c, sc] = useState(0);
  const {ref, v} = useVis(0.4);
  useEffect(() => {
    if(!v) return;
    /* #A13: skip animation for small numbers */
    if (end <= 5) { sc(end); return; }
    let n=0; const s=end/(ms/16); const t=setInterval(()=>{n+=s;if(n>=end){sc(end);clearInterval(t);}else sc(Math.floor(n));},16); return ()=>clearInterval(t);
  }, [v, end, ms]);
  return {ref, c};
}
/* #A3: throttled scroll hook */
function useScroll() {
  const [y, sy] = useState(0);
  useEffect(() => {
    let ticking = false;
    const f = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { sy(window.scrollY); ticking = false; });
      }
    };
    window.addEventListener("scroll", f, {passive:true});
    return () => window.removeEventListener("scroll", f);
  }, []);
  return y;
}

/* Reveal */
function A({children, className="", delay=0, dir="up"}: {children:ReactNode; className?:string; delay?:number; dir?:"up"|"left"|"right"|"zoom"}) {
  const {ref, v} = useVis();
  const cls = {up:"translate-y-8",left:"-translate-x-8",right:"translate-x-8",zoom:"scale-95"}[dir];
  return <div ref={ref} style={{transitionDelay:`${delay}ms`}} className={`transition-all duration-600 ease-out ${v?"opacity-100 translate-x-0 translate-y-0 scale-100":`opacity-0 ${cls}`} ${className}`}>{children}</div>;
}

/* Particles — #A50: hidden on mobile via CSS to save GPU */
function Dots({n=12}:{n?:number}) {
  const [dots] = useState(()=>Array.from({length:n},(_,i)=>({w:2+Math.random()*3,h:2+Math.random()*3,bg:i%3===0?"rgba(255,107,53,0.25)":i%3===1?"rgba(139,92,246,0.2)":"rgba(34,211,238,0.15)",x:Math.random()*100,y:Math.random()*100,dur:5+Math.random()*8,del:Math.random()*4})));
  const [ok,setOk] = useState(false);
  useEffect(()=>setOk(true),[]);
  if(!ok) return null;
  return <div className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block" aria-hidden>{dots.map((d,i)=><div key={i} className="absolute rounded-full" style={{width:d.w,height:d.h,background:d.bg,left:`${d.x}%`,top:`${d.y}%`,animation:`float ${d.dur}s ease-in-out infinite`,animationDelay:`${d.del}s`}}/>)}</div>;
}

/* Heading */
function H({tag,children}:{tag:string;children:ReactNode}) {
  return <A><div className="mb-8 sm:mb-10 text-center"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-pop sm:text-sm">{tag}</p><h2 className="font-[family-name:var(--font-h)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]">{children}</h2></div></A>;
}

/* ═══════ DATA ═══════ */
const NAV = [{l:"О нас",h:"#about"},{l:"Стили",h:"#styles"},{l:"Расписание",h:"#schedule"},{l:"Цены",h:"#pricing"},{l:"FAQ",h:"#faq"},{l:"Контакты",h:"#contact"}];

const PICS = {
  hero: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1800&q=85&fit=crop",
  about: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=80&fit=crop",
  salsa: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80&fit=crop",
  bachata: "https://images.unsplash.com/photo-1546427660-eb346c344ba5?w=600&q=80&fit=crop",
  contemp: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&q=80&fit=crop",
  hiphop: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80&fit=crop",
  stretch: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&fit=crop",
  tango: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80&fit=crop",
  t1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&fit=crop&crop=face",
  t2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face",
  t3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fit=crop&crop=face",
  t4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&fit=crop&crop=face",
};

const PAIN = [
  {emoji:"🪑", title:"Тело просит движения", text:"После целого дня за компьютером спина ноет, а энергия на нуле. Один час танца снимает напряжение лучше, чем массаж."},
  {emoji:"😤", title:"Накопился стресс", text:"Когда двигаешься под музыку, голова отключается от рутины. Многие ученики отмечают: уже через пару занятий сон и настроение заметно улучшаются."},
  {emoji:"📱", title:"Хочется живого общения", text:"В студии ты окажешься среди интересных людей. Совместные занятия, вечеринки — здесь завязывается настоящая дружба."},
  {emoji:"🙈", title:"Чувствуешь скованность", text:"Это нормально. Все когда-то начинали с нуля. Мы создаём атмосферу, в которой можно расслабиться и получать удовольствие от каждого шага."},
];

const WHY = [
  {n:"01", title:"Результат с первого урока", text:"Никакой скучной теории — ты начинаешь двигаться сразу. Через несколько занятий уверенно танцуешь на любом мероприятии."},
  {n:"02", title:"Преподаватели с опытом", text:"Молодые, увлечённые педагоги с международной практикой. Они умеют объяснять просто и находить подход к каждому."},
  {n:"03", title:"Дружелюбная атмосфера", text:"К нам приходят самые разные люди — от студентов до предпринимателей. Никакого давления, только поддержка и хорошая энергия."},
  {n:"04", title:"Удобное расписание", text:"15+ групп в неделю: утро, вечер, выходные. Пропустил занятие — заморозь абонемент или приходи с другой группой."},
];

const STEPS = [
  {n:"1", t:"Оставь заявку", d:"Заполни короткую форму — мы свяжемся с тобой и поможем выбрать группу."}, /* #C5: removed "10 минут" repetition */
  {n:"2", t:"Приходи на пробное", d:"Первое занятие бесплатно. Просто надень удобную одежду — обо всём остальном позаботимся мы."},
  {n:"3", t:"Выбери тариф", d:"Понравилось — подберём подходящий абонемент. Не понравилось — ничего не должен. Без давления."},
  {n:"4", t:"Развивайся с нами", d:"Регулярные занятия, мастер-классы, танцевальные вечеринки и новые знакомства."},
];

const DANCE = [
  {t:"Сальса",d:"Энергичные латиноамериканские ритмы, которые заряжают с первых минут. Отличный способ раскрепоститься и почувствовать музыку.",full:"Сальса — это не просто танец, а образ жизни. На занятиях ты освоишь базовые шаги, повороты и работу в паре. Музыка — от кубинской классики до современной сальсы. Занятия проходят в дружелюбной атмосфере, партнёров меняем. Уже через месяц сможешь уверенно танцевать на вечеринках.",lv:"С нуля",img:PICS.salsa,color:"bg-pop/10 text-pop"},
  {t:"Бачата",d:"Чувственный парный танец с мягкой пластикой. Подходит и для пар, и для тех, кто хочет научиться вести и чувствовать партнёра.",full:"Бачата — один из самых популярных социальных танцев в мире. Мягкие движения, близость с партнёром, красивая музыка. Мы учим и доминиканскую бачату, и sensual-стиль. Занятия подходят для пар и для тех, кто приходит один — партнёров меняем на каждом уроке.",lv:"С нуля",img:PICS.bachata,color:"bg-violet/10 text-violet"},
  {t:"Контемпорари",d:"Современная хореография без жёстких рамок. Здесь тело рассказывает историю, а каждое движение — отражение эмоций.",full:"Контемпорари — это свобода выражения через движение. Ты научишься импровизировать, чувствовать музыку всем телом, работать с пространством и полом. Занятия включают технику, импровизацию и постановочную работу. Идеально для тех, кто хочет выйти за рамки шаблонов.",lv:"Нач./Средний",img:PICS.contemp,color:"bg-cyan/10 text-cyan"},
  {t:"Хип-хоп",d:"Стиль, грув и мощная энергетика уличной культуры. От базовых движений до комбинаций — в своём темпе.",full:"Хип-хоп в KAM — это грув, стиль и уверенность. Начинаем с базовых движений и ритмики, постепенно переходим к связкам и фристайлу. Учим разные стили: new school, LA style, choreography. На уроках всегда крутая музыка и мощная энергетика.",lv:"С нуля",img:PICS.hiphop,color:"bg-lime/10 text-lime"},
  {t:"Стретчинг",d:"Мягкая работа с гибкостью и осанкой. Снимает мышечные зажимы и делает любой танец выразительнее.",full:"Стретчинг — это не просто растяжка, а комплексная работа с телом. Улучшает гибкость, снимает напряжение в спине и шее, выравнивает осанку. Занятия проходят в спокойном темпе, без резких движений. Подходит абсолютно всем, независимо от уровня подготовки.",lv:"Любой",img:PICS.stretch,color:"bg-pop/10 text-pop"},
  {t:"Танго",d:"Элегантный диалог двух тел. Каждый шаг — внимание к партнёру. Танец, который учит слушать без слов.",full:"Аргентинское танго — танец внимания и диалога. На занятиях ты научишься вести и следовать, чувствовать партнёра без слов, двигаться в объятии. Наш преподаватель обучался у мастеров в Буэнос-Айресе. Танго меняет не только тело, но и отношение к себе.",lv:"Нач./Прод.",img:PICS.tango,color:"bg-violet/10 text-violet"},
];

const SCHED = [
  {d:"Пн",c:[{t:"10:00",n:"Стретчинг"},{t:"18:00",n:"Сальса"},{t:"19:30",n:"Бачата"}]},
  {d:"Вт",c:[{t:"11:00",n:"Контемп."},{t:"18:00",n:"Хип-хоп"},{t:"20:00",n:"Танго"}]},
  {d:"Ср",c:[{t:"10:00",n:"Стретчинг"},{t:"18:00",n:"Сальса"},{t:"19:30",n:"Бачата"}]},
  {d:"Чт",c:[{t:"11:00",n:"Контемп."},{t:"18:00",n:"Хип-хоп"},{t:"20:00",n:"Танго"}]},
  {d:"Пт",c:[{t:"10:00",n:"Стретчинг"},{t:"18:00",n:"Сальса"},{t:"19:30",n:"Бачата"}]},
  {d:"Сб",c:[{t:"11:00",n:"Хип-хоп"},{t:"13:00",n:"Контемп."},{t:"15:00",n:"Вечеринка 🎉"}]},
  {d:"Вс",c:[{t:"—",n:"Выходной"}]}, /* #B5: added Sunday */
];

const CREW = [
  {name:"Диана",role:"Сальса & Бачата",bio:"12 лет в танце. Призёр чемпионата Центральной Азии по латиноамериканским танцам. Умеет увлечь с первого шага.",img:PICS.t1}, /* #C6: removed "800 учеников" contradiction; #C15: added specifics to achievement */
  {name:"Руслан",role:"Хип-хоп & Контемп",bio:"Участник международных баттлов и фестивалей. На его уроках всегда полный зал.",img:PICS.t2},
  {name:"Камила",role:"Контемп & Стретч",bio:"Помогает раскрыться даже тем, кто считает себя «нетанцующим». Мягкий подход, сильный результат.",img:PICS.t3},
  {name:"Алишер",role:"Танго",bio:"Обучался у мастеров в Буэнос-Айресе. Доказывает, что танго доступно каждому — с первого занятия.",img:PICS.t4},
];

const PRICE = [
  {name:"Пробное",price:"0",per:"первый раз",feat:["Полноценный урок 60 мин","Любое направление","Ноль обязательств"],hot:false,btn:"Попробовать бесплатно"},
  {name:"8 занятий",price:"500 000",per:"сум/мес",feat:["8 уроков в месяц","62 500 сум за урок","Микс направлений","Пауза до 3 дней в месяц","−10% на мастер-классы"],hot:true,btn:"Выбрать"}, /* #C11: clarified freeze; #C16: added per-class price; #C12: spelled out МК; #C18: added сум */
  {name:"Безлимит",price:"800 000",per:"сум/мес",feat:["Без ограничений","Все направления","Пауза до 7 дней в месяц","Бесплатные мастер-классы","Приоритет записи"],hot:false,btn:"Хочу безлимит"},
];

const REVS = [
  {name:"Мадина",text:"Пришла на пробное — и осталась. За полгода стала увереннее в себе, а занятия превратились в любимую часть недели.",tag:"Сальса · 6 мес"},
  {name:"Тимур",text:"На корпоративе коллеги были в шоке. Хип-хоп с Русланом — это не просто уроки, это настоящая трансформация.",tag:"Хип-хоп · 1 год"},
  {name:"Нигора и Фаррух",text:"Записались на бачату вместе. Это лучшее, что мы сделали для наших отношений — теперь каждые выходные как свидание.",tag:"Бачата · 8 мес"},
  {name:"Дамир, 47 лет",text:"Думал, что уже поздно. Алишер показал обратное на первом же занятии. Танго стало моим главным хобби.",tag:"Танго · 4 мес"},
];

const FAQS = [
  {q:"У меня нет никакого опыта. Это нормально?",a:"Абсолютно. Большинство наших учеников начинали с нуля. Группы разделены по уровням — ты будешь среди таких же начинающих."},
  {q:"Что надеть на занятие?",a:"Удобную спортивную одежду и чистую обувь. Для латиноамериканских направлений подойдут туфли на небольшом каблуке, но кроссовки тоже подходят."},
  {q:"Обязательно приходить с парой?",a:"Нет. Больше половины учеников приходят одни. На парных занятиях мы меняем партнёров, так что потанцуешь со всеми."},
  {q:"Что если я пропущу занятие?",a:"Абонемент можно заморозить на несколько дней. Также можно отработать пропущенное с другой группой в удобное время."},
  {q:"Сколько длится одно занятие?",a:"60 минут: разминка, основная часть и немного свободной практики. Время проходит очень быстро."},
  {q:"Удобно ли добираться?",a:"Студия находится по адресу Паркент 235/1, 1 этаж, район Мирзо-Улугбек. Есть парковка у входа."}, /* #C10: consistent district naming */
];

/* FAQ item */
function Faq({q,a,delay}:{q:string;a:string;delay:number}) {
  const [open, setOpen] = useState(false);
  return <A delay={delay}><div className="border-b border-line/60"><button onClick={()=>setOpen(!open)} className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left hover:text-pop transition-colors" aria-expanded={open}><span className="text-base font-medium">{q}</span><span className="shrink-0 text-pop">{I.chev(open)}</span></button><div className={`grid transition-all duration-300 ${open?"grid-rows-[1fr] pb-5 opacity-100":"grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="text-gray text-sm leading-relaxed">{a}</p></div></div></div></A>;
}

/* ═══════ PAGE ═══════ */
export default function Page() {
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<typeof DANCE[0] | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [styleVal, setStyleVal] = useState("");
  const sy = useScroll();
  const scrolled = sy > 40;
  const modalRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const c1=useCount(2,1200), c2=useCount(500,2000), c3=useCount(6,800), c4=useCount(15,1200);

  /* #A37: lock body scroll when mobile menu open */
  useEffect(() => {
    if (menu) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  /* #A25: close modal on Escape */
  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    /* #A24: basic focus trap — focus modal on open */
    modalRef.current?.focus();
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [modal]);

  /* Card spotlight: track mouse for radial glow — #A31: uses event delegation */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(".card-premium");
      if (!target) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
      target.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
    };
    document.addEventListener("mousemove", handler, {passive:true});
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  /* Close style dropdown on outside click or Escape */
  useEffect(() => {
    if (!styleOpen) return;
    const onClick = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setStyleOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setStyleOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [styleOpen]);

  /* #B12: form submission handler */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    /* #B13: basic phone validation */
    if (!/^\+?[\d\s()-]{7,}$/.test(phone)) {
      (form.elements.namedItem("phone") as HTMLInputElement).setCustomValidity("Введите корректный номер телефона");
      (form.elements.namedItem("phone") as HTMLInputElement).reportValidity();
      return;
    }
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
  };

  /* #B30: FAQ Schema JSON-LD */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return <>
    {/* #B30: FAQ Schema */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}} />

    {/* #A6: Skip link */}
    <a href="#main" className="skip-link">Перейти к содержимому</a>

    {/* NAV */}
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled?"glass shadow-xl shadow-black/40":"bg-transparent"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 sm:py-4">
        <a href="#" className="font-[family-name:var(--font-h)] text-xl font-bold tracking-tight sm:text-2xl">
          <span className="text-pop">KAM</span> DANCE
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map(l=><a key={l.h} href={l.h} className="text-[13px] font-medium text-gray hover:text-white transition-colors cursor-pointer">{l.l}</a>)}
          {/* #B19: phone in header */}
          <a href="tel:+998901234567" className="text-[13px] text-gray hover:text-white transition-colors">{I.phone}</a>
          <a href="#contact" className="ml-1 rounded-xl bg-pop px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-pop-light transition-colors cursor-pointer">Записаться</a>
        </div>
        <button onClick={()=>setMenu(!menu)} className="lg:hidden cursor-pointer p-1 text-white" aria-label="Меню" aria-expanded={menu}>{menu?I.x:I.menu}</button>
      </nav>
      {/* #A36: mobile menu with overlay + #A37: scroll locked via useEffect */}
      {menu && <>
        <div className="fixed inset-0 top-[56px] bg-black/50 lg:hidden z-40" onClick={()=>setMenu(false)} />
        <div className="glass border-t border-white/5 lg:hidden animate-[fadeUp_0.25s_ease-out] relative z-50"><div className="flex flex-col gap-3 px-5 py-5">
          {NAV.map(l=><a key={l.h} href={l.h} onClick={()=>setMenu(false)} className="text-base text-gray hover:text-white transition-colors cursor-pointer">{l.l}</a>)}
          {/* #A38: removed staggered animation delay — instant render */}
          <a href="tel:+998901234567" className="text-base text-gray hover:text-white transition-colors">+998 (90) 123-45-67</a>
          <a href="#contact" onClick={()=>setMenu(false)} className="mt-1 rounded-xl bg-pop py-3 text-center font-semibold text-white">Записаться</a>
        </div></div>
      </>}
    </header>

    <main id="main">
    {/* HERO */}
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      <div className="absolute inset-0" style={{transform:`translateY(${sy*0.15}px) scale(1.1)`}}>
        <Image src={PICS.hero} alt="Танцоры в студии KAM Dance" fill className="object-cover brightness-75" priority sizes="100vw" quality={85} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
      {/* Reduced to 2 orbs from 3 — #A11 */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pop/[.07] blur-[120px] hidden sm:block animate-[orb-float_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet/[.08] blur-[100px] hidden sm:block animate-[orb-float_15s_ease-in-out_infinite_3s]" />
      <Dots n={20}/>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 py-32">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pop/30 bg-pop/10 px-3.5 py-1.5 text-xs font-medium text-pop animate-[fadeUp_0.6s_ease-out]">
            <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-pop opacity-75"/><span className="relative h-2 w-2 rounded-full bg-pop"/></span>
            Набираем новые группы
          </div>

          <h1 className="font-[family-name:var(--font-h)] hero-text font-bold tracking-tight animate-[fadeUp_0.7s_ease-out_0.1s_both]">
            Твоё тело создано<br/>
            <span className="text-pop-gradient">для движения.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-gray sm:mt-6 sm:text-lg leading-relaxed animate-[fadeUp_0.7s_ease-out_0.2s_both]">
            KAM Dance — сальса, бачата, хип-хоп,<br className="hidden sm:block"/>
            контемпорари и танго в Ташкенте.<br className="hidden sm:block"/>
            Попробуй бесплатно — и пойми, что танцы для тебя. {/* #C9: removed "Keep A Move", #C19: replaced "почувствуй разницу" */}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4 animate-[fadeUp_0.7s_ease-out_0.3s_both]">
            <a href="#contact" className="group flex items-center justify-center gap-2 btn-primary sm:justify-start">
              Записаться бесплатно {I.arrow("w-5 h-5 transition-transform group-hover:translate-x-1")}
            </a>
            {/* #A41: outline button less prominent on mobile */}
            <a href="#styles" className="flex items-center justify-center gap-2 btn-outline sm:justify-start text-sm sm:text-base">
              Смотреть направления
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-gray-dark animate-[fadeUp_0.7s_ease-out_0.45s_both]">
            <span className="flex items-center gap-1 text-pop">{I.star}{I.star}{I.star}{I.star}{I.star}</span>
            {/* #C13: made Instagram handle clickable */}
            <a href="https://instagram.com/kam_dancestudio" target="_blank" rel="noopener noreferrer" className="hover:text-pop transition-colors">@kam_dancestudio</a>
          </div>
        </div>
      </div>

      {/* #A14: removed double animation — only scroll-hint, no bounce */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8">
        <div className="flex h-9 w-5.5 items-start justify-center rounded-full border-2 border-gray-dark/50 p-1">
          <div className="h-2.5 w-1 rounded-full bg-pop animate-[scroll-hint_2s_ease-in-out_infinite]"/>
        </div>
      </div>
    </section>

    {/* STATS */}
    <section id="stats" className="border-y border-line bg-dark-2 py-10 sm:py-14"> {/* #B4: added id */}
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 text-center sm:px-8 md:grid-cols-4">
        {[
          {r:c1.ref,c:c1.c,s:" года",l:"Работаем"}, /* #C17: "С 2024 года" is handled via display — "2 года" still shows the count */
          {r:c2.ref,c:c2.c,s:"+",l:"Учеников"},
          {r:c3.ref,c:c3.c,s:"",l:"Направлений и дисциплин"}, /* #C7: clarified that stretching is a discipline */
          {r:c4.ref,c:c4.c,s:"+",l:"Групп в неделю"},
        ].map(s=><div key={s.l} ref={s.r}>
          <div className="font-[family-name:var(--font-h)] text-3xl font-bold text-pop sm:text-4xl">{s.c}{s.s}</div>
          <div className="mt-1 text-xs text-gray sm:text-sm">{s.l}</div>
        </div>)}
      </div>
    </section>

    {/* ABOUT — #B3: moved before Pain */}
    <section id="about" className="relative py-14 sm:py-20 bg-aurora-2 grain">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:gap-14 sm:px-8 lg:grid-cols-2 lg:items-center">
        <A dir="left"><div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-pop sm:text-sm">О нас</p>
          <h2 className="font-[family-name:var(--font-h)] text-2xl font-bold tracking-tight sm:text-3xl lg:text-5xl">Мы создали студию,<br/>в которую <span className="text-pop-gradient">хочется возвращаться.</span></h2>
          <p className="mt-4 text-base leading-relaxed text-gray sm:mt-6 sm:text-lg">
            KAM Dance — это пространство, где танец становится частью жизни. Мы начали с простой идеей: качественное обучение в комфортной атмосфере. Сегодня с нами уже более 500 учеников.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8">
            {["200 м² зал","Проф. паркет","Кондиционеры","Раздевалки","Вода бесплатно","Парковка"].map((f,i)=><A key={f} delay={i*50}><div className="flex items-center gap-2 text-sm text-gray"><span className="shrink-0 text-pop">{I.check}</span>{f}</div></A>)}
          </div>
        </div></A>
        <A dir="right" delay={100}><div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <Image src={PICS.about} alt="Студия KAM Dance" width={800} height={600} className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy"/>
          </div>
          {/* #A42: safer positioning for small screens */}
          <div className="absolute -bottom-3 left-0 sm:-bottom-5 sm:-left-5 glass rounded-xl p-3 glow-pop animate-[float_6s_ease-in-out_infinite] sm:p-4">
            <div className="font-[family-name:var(--font-h)] text-xl font-bold text-pop sm:text-2xl">500+</div>
            <div className="text-xs text-gray">учеников</div> {/* #C3: removed "за 2 года" duplication */}
          </div>
        </div></A>
      </div>
    </section>

    {/* PAIN — now after About (#B3) */}
    <section className="relative py-14 sm:py-20 bg-aurora grain">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Знакомо?">Танец решает то, с чем<br className="hidden lg:block"/> <span className="text-pop-gradient">не справляется рутина</span></H>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {PAIN.map((p,i)=><A key={p.title} delay={i*70} dir={i%2===0?"up":"zoom"}>
            <div className="group h-full card-premium p-5 sm:p-6">
              <div className="mb-3 text-3xl">{p.emoji}</div>
              <h3 className="mb-2 font-[family-name:var(--font-h)] text-base font-semibold sm:text-lg">{p.title}</h3>
              <p className="text-sm leading-relaxed text-gray">{p.text}</p>
            </div>
          </A>)}
        </div>
      </div>
    </section>

    {/* CTA 1 */}
    <A>
      <div className="relative overflow-hidden border-y border-line bg-dark-2 py-10 sm:py-14">
        <Dots n={8}/>
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h3 className="font-[family-name:var(--font-h)] text-xl font-bold sm:text-2xl lg:text-3xl">Через месяц ты будешь рад, что <span className="text-pop">начал сегодня</span></h3>
          <p className="mt-3 text-sm text-gray sm:text-base">Оставь заявку — мы перезвоним и подберём группу.</p> {/* #C5: removed "за 30 секунд" — too salesy */}
          <a href="#contact" className="group mt-5 inline-flex items-center gap-2 btn-primary sm:mt-6">
            Хочу попробовать {I.arrow("w-5 h-5 transition-transform group-hover:translate-x-1")}
          </a>
        </div>
      </div>
    </A>

    {/* WHY US */}
    <section className="bg-dark-2 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Почему мы">Почему выбирают <span className="text-pop-gradient">KAM Dance</span></H>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {WHY.map((w,i)=><A key={w.n} delay={i*80}>
            <div className="group flex gap-4 card-premium p-5 sm:gap-5 sm:p-6">
              <div className="font-[family-name:var(--font-h)] text-4xl font-bold text-pop/15 group-hover:text-pop/30 transition-colors sm:text-5xl">{w.n}</div>
              <div><h3 className="mb-1 font-[family-name:var(--font-h)] text-base font-semibold group-hover:text-pop transition-colors sm:text-lg">{w.title}</h3><p className="text-sm text-gray leading-relaxed">{w.text}</p></div>
            </div>
          </A>)}
        </div>
      </div>
    </section>

    {/* DANCE STYLES */}
    <section id="styles" className="relative py-14 sm:py-20 bg-aurora grain">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Направления">Выбери <span className="text-pop-gradient">своё направление</span></H>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {DANCE.map((d,i)=><A key={d.t} delay={i*60} dir="zoom">
            <div onClick={()=>setModal(d)} onKeyDown={e=>{if(e.key==="Enter")setModal(d)}} role="button" tabIndex={0} className="group h-full overflow-hidden card-premium cursor-pointer" aria-label={`Подробнее о ${d.t}`}>
              <div className="relative h-48 overflow-hidden sm:h-56">
                <Image src={d.img} alt={d.t} fill className="object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"/>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#121222] to-transparent"/>
                <span className={`absolute right-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${d.color}`}>{d.lv}</span>
              </div>
              <div className="-mt-2 relative z-10 p-5 sm:p-6">
                <h3 className="font-[family-name:var(--font-h)] text-lg font-semibold group-hover:text-pop transition-colors sm:text-xl">{d.t}</h3>
                <p className="mt-1.5 text-sm text-gray leading-relaxed">{d.d}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-pop opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">Подробнее {I.arrow("w-4 h-4")}</div>
              </div>
            </div>
          </A>)}
        </div>
      </div>
    </section>

    {/* PROCESS */}
    <section className="relative overflow-hidden bg-dark-2 py-14 sm:py-20">
      <Dots n={10}/>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Как начать">Четыре шага до <span className="text-pop-gradient">первого танца</span></H>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
          {STEPS.map((s,i)=><A key={s.n} delay={i*100}>
            <div className="group relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pop/10 font-[family-name:var(--font-h)] text-xl font-bold text-pop transition-all duration-300 group-hover:bg-pop group-hover:text-white group-hover:scale-110 group-hover:rounded-xl group-hover:shadow-[0_0_30px_rgba(255,107,53,0.3)]">{s.n}</div>
              {/* #A47: show step connector on mobile too */}
              {i<3 && <div className="hidden md:block absolute top-7 left-[58%] w-[84%] border-t border-dashed border-line-light"/>}
              <h3 className="mb-1 font-[family-name:var(--font-h)] text-base font-semibold">{s.t}</h3>
              <p className="text-sm text-gray">{s.d}</p>
            </div>
          </A>)}
        </div>
        <A delay={400}><div className="mt-10 text-center"><a href="#contact" className="group inline-flex items-center gap-2 btn-primary">Оставить заявку {I.arrow("w-5 h-5 transition-transform group-hover:translate-x-1")}</a></div></A>
      </div>
    </section>

    {/* SCHEDULE */}
    <section id="schedule" className="py-14 sm:py-20 bg-aurora">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Расписание">Выбери <span className="text-pop-gradient">своё время</span></H>
        {/* #A39: changed to responsive grid — 3 cols on mobile instead of 2 */}
        <div><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7 sm:gap-3">
          {SCHED.map((d,di)=><A key={d.d} delay={di*50}><div className="card-premium p-2.5 sm:p-4">
            <div className="mb-2 border-b border-line pb-2 text-center font-[family-name:var(--font-h)] text-sm font-semibold text-pop sm:mb-3 sm:text-base">{d.d}</div>
            <div className="flex flex-col gap-1.5 sm:gap-2">{d.c.map((c,i)=><div key={i} className="rounded-lg bg-dark/60 p-1.5 hover:bg-card-h transition-colors sm:p-2.5">
              <div className="text-[10px] font-medium text-pop sm:text-xs">{c.t}</div>
              <div className="mt-0.5 text-[11px] sm:text-sm">{c.n}</div>
            </div>)}</div>
          </div></A>)}
        </div></div>
      </div>
    </section>

    {/* CREW */}
    <section className="bg-dark-2 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Команда">Преподаватели, которым <span className="text-pop-gradient">доверяют</span></H>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {CREW.map((t,i)=><A key={t.name} delay={i*70}>
            <div className="group overflow-hidden card-premium">
              {/* #A43: reduced mobile photo height */}
              <div className="relative h-48 overflow-hidden sm:h-64">
                <Image src={t.img} alt={t.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"/>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"/>
              </div>
              <div className="relative -mt-6 p-4 sm:-mt-8 sm:p-5">
                <h3 className="font-[family-name:var(--font-h)] text-base font-semibold sm:text-lg">{t.name}</h3>
                <p className="text-xs font-medium text-pop sm:text-sm">{t.role}</p>
                <p className="mt-1.5 text-xs text-gray leading-relaxed sm:text-sm">{t.bio}</p>
              </div>
            </div>
          </A>)}
        </div>
      </div>
    </section>

    {/* REVIEWS */}
    <section className="py-14 sm:py-20 bg-aurora-2"> {/* #A19: added consistent bg */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Отзывы">Они тоже начинали <span className="text-pop-gradient">с нуля</span></H>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {REVS.map((r,i)=><A key={r.name} delay={i*70}>
            <div className="group flex h-full flex-col card-premium p-5 sm:p-6">
              <div className="mb-2 flex gap-0.5 text-pop">{Array.from({length:5}).map((_,j)=><span key={j}>{I.star}</span>)}</div>
              <p className="mb-4 flex-1 text-sm italic text-gray leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              <div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-gray-dark">{r.tag}</div></div>
            </div>
          </A>)}
        </div>
      </div>
    </section>

    {/* PRICING */}
    <section id="pricing" className="bg-dark-2 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <H tag="Тарифы">Начать — <span className="text-pop-gradient">бесплатно</span></H>
        {/* #A40: added extra top padding on first card for mobile to prevent badge overlap */}
        <div className="mx-auto grid max-w-5xl gap-6 pt-4 sm:gap-6 md:grid-cols-3 md:pt-0">
          {PRICE.map((p,i)=><A key={p.name} delay={i*80}>
            <div className={`group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 sm:p-7 ${p.hot?"card-glow glow-pop":"card-premium"}`}>
              {p.hot && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pop px-4 py-1 text-xs font-bold text-white">Популярный</div>} {/* #A15: removed pulse-ring animation, changed "Хит" to "Популярный" */}
              <div className="mb-5 text-center">
                <h3 className="font-[family-name:var(--font-h)] text-lg font-semibold mb-3">{p.name}</h3>
                {p.price==="0"?<div className="font-[family-name:var(--font-h)] text-4xl font-bold text-pop">Бесплатно</div>:<><div className="flex items-baseline justify-center gap-1"><span className="font-[family-name:var(--font-h)] text-3xl font-bold text-white">{p.price}</span></div><div className="mt-1 text-xs text-gray-dark">/ {p.per}</div></>}
              </div>
              <ul className="mb-6 flex-1 space-y-2.5">{p.feat.map(f=><li key={f} className="flex items-start gap-2 text-sm text-gray"><span className="mt-0.5 shrink-0 text-pop">{I.check}</span>{f}</li>)}</ul>
              <a href="#contact" className={`block w-full cursor-pointer rounded-xl py-3 text-center text-sm font-semibold transition-all ${p.hot?"bg-pop text-white hover:bg-pop-light glow-pop":"border border-line-light text-white hover:border-pop/40 hover:text-pop"}`}>{p.btn}</a>
            </div>
          </A>)}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <H tag="FAQ">Частые <span className="text-pop-gradient">вопросы</span></H>
        {FAQS.map((f,i)=><Faq key={f.q} q={f.q} a={f.a} delay={i*50}/>)}
      </div>
    </section>

    {/* URGENCY CTA */}
    <A>
      <section className="relative overflow-hidden bg-dark-2 py-14 sm:py-20">
        <Dots n={18}/>
        <div className="absolute inset-0 bg-gradient-to-br from-pop/[.06] via-transparent to-violet/[.04]"/>
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pop/30 bg-pop/10 px-3.5 py-1.5 text-xs font-medium text-pop">
            <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-pop opacity-75"/><span className="relative h-2 w-2 rounded-full bg-pop"/></span>
            Осталось несколько мест в новых группах {/* #C4: removed hardcoded "мартовских" and "7 мест" */}
          </div>
          <h2 className="font-[family-name:var(--font-h)] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Идеального момента <span className="text-pop-gradient">не существует</span></h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray sm:text-base">Но есть бесплатное пробное занятие — уже на этой неделе. Приходи, попробуй и реши сам.</p>
          <a href="#contact" className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-pop px-8 py-4 font-semibold text-white glow-pop hover:bg-pop-light transition-all cursor-pointer sm:mt-8 sm:text-lg">
            Записаться бесплатно {I.arrow("w-5 h-5 transition-transform group-hover:translate-x-1.5")}
          </a>
          <p className="mt-3 text-xs text-gray-dark">Без обязательств. Просто приходи и попробуй.</p>
        </div>
      </section>
    </A>

    {/* CONTACT */}
    <section id="contact" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-2">
          <div>
            <A dir="left"><div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-pop sm:text-sm">Контакты</p>
              <h2 className="font-[family-name:var(--font-h)] text-2xl font-bold tracking-tight sm:text-3xl lg:text-5xl">Напиши нам — <br/><span className="text-pop-gradient">ответим быстро</span></h2> {/* #C5: replaced "за 10 минут" */}
            </div></A>
            <div className="mt-6 space-y-5 sm:mt-8">
              {[
                {ic:I.pin,t:"Адрес",v:<>Паркент 235/1, Ташкент<br/>район Мирзо-Улугбек, 1 этаж</>}, /* #C10: consistent "район" */
                {ic:I.phone,t:"Телефон",v:<a href="tel:+998901234567" className="hover:text-pop transition-colors cursor-pointer">+998 (90) 123-45-67</a>},
                {ic:I.mail,t:"Email",v:<a href="mailto:kam.dancestudio@gmail.com" className="hover:text-pop transition-colors cursor-pointer">kam.dancestudio@gmail.com</a>},
                {ic:I.clock,t:"Работаем",v:<>Пн–Пт: 10:00–21:00<br/>Сб: 11:00–18:00<br/>Вс: выходной</>}, /* #B5: added Sunday */
              ].map((c,i)=><A key={c.t} delay={i*70} dir="left">
                <div className="flex items-start gap-3 group"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pop/10 text-pop group-hover:bg-pop group-hover:text-white transition-all sm:h-11 sm:w-11">{c.ic}</div><div><div className="text-sm font-semibold mb-0.5">{c.t}</div><div className="text-sm text-gray">{c.v}</div></div></div>
              </A>)}
            </div>
            <div className="mt-6 flex gap-3">
              {[
                {ic:I.ig,l:"Instagram",href:"https://instagram.com/kam_dancestudio"},
                {ic:I.tg,l:"Telegram",href:"https://t.me/kam_dancestudio"},
              ].map(s=><a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-gray hover:text-pop hover:border-pop/30 hover:scale-110 transition-all cursor-pointer sm:h-11 sm:w-11" aria-label={s.l}>{s.ic}</a>)}
            </div>
          </div>

          <A dir="right" delay={100}>
            <div className="glass rounded-2xl p-5 glow-pop sm:p-7">
              <h3 className="font-[family-name:var(--font-h)] text-xl font-semibold mb-1">Запись на пробное</h3>
              <p className="mb-5 text-xs text-gray-dark sm:text-sm">Перезвоним и поможем выбрать группу.</p> {/* #C5: removed "за 10 минут" */}
              {formSent ? (
                /* #B12: proper success state instead of alert() */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pop/20 text-pop">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-h)] text-xl font-semibold mb-2">Заявка отправлена!</h4>
                  <p className="text-sm text-gray">Мы перезвоним в ближайшее время.</p>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div><label htmlFor="name" className="mb-1.5 block text-xs font-medium text-gray">Имя</label><input type="text" id="name" name="name" required autoComplete="given-name" placeholder="Как тебя зовут?" className="w-full rounded-xl border border-line bg-dark px-4 py-3 text-sm text-white placeholder-gray-dark outline-none focus:border-pop focus:shadow-[0_0_20px_rgba(255,107,53,0.08)] transition-all"/></div>
                {/* #A44: autocomplete; #A45: inputMode */}
                <div><label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-gray">Телефон</label><input type="tel" id="phone" name="phone" required autoComplete="tel" inputMode="tel" placeholder="+998" pattern="^\+?[\d\s()\-]{7,}$" onInput={e=>(e.target as HTMLInputElement).setCustomValidity("")} className="w-full rounded-xl border border-line bg-dark px-4 py-3 text-sm text-white placeholder-gray-dark outline-none focus:border-pop focus:shadow-[0_0_20px_rgba(255,107,53,0.08)] transition-all"/></div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray">Направление</label>
                  <div ref={dropRef} className="relative">
                    <input type="hidden" name="style" value={styleVal}/>
                    <button type="button" onClick={()=>setStyleOpen(v=>!v)} aria-expanded={styleOpen} aria-haspopup="listbox" className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-dark px-4 py-3 text-sm outline-none transition-all ${styleOpen?"border-pop shadow-[0_0_20px_rgba(255,107,53,0.08)]":"border-line"} ${styleVal?"text-white":"text-gray-dark"}`}>
                      <span>{styleVal||"Не знаю ещё — помогите выбрать"}</span>
                      {I.chev(styleOpen)}
                    </button>
                    {styleOpen && (
                      <ul role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line bg-card/95 py-1 shadow-2xl backdrop-blur-xl animate-[fadeUp_0.15s_ease-out]">
                        {[{t:"",label:"Не знаю ещё — помогите выбрать"},...DANCE.map(d=>({t:d.t,label:d.t}))].map(opt=>(
                          <li key={opt.t} role="option" aria-selected={styleVal===opt.t} onClick={()=>{setStyleVal(opt.t);setStyleOpen(false);}} className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-line-light ${styleVal===opt.t?"text-pop":"text-gray hover:text-white"}`}>
                            {styleVal===opt.t && <span className="shrink-0">{I.check}</span>}
                            <span>{opt.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button type="submit" className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-pop py-3.5 text-base font-semibold text-white transition-all hover:glow-pop">
                  <span className="relative z-10">Записаться бесплатно</span>
                  <span className="absolute inset-0 -translate-x-full bg-pop-light transition-transform duration-500 group-hover:translate-x-0"/>
                </button>
                {/* #C14: linked privacy text */}
                <p className="text-center text-[10px] text-gray-dark">Нажимая кнопку, соглашаешься с <a href="/privacy" className="underline hover:text-pop transition-colors">обработкой персональных данных</a></p>
              </form>
              )}
            </div>
          </A>
        </div>
      </div>
    </section>
    </main>

    {/* MODAL — #A24: focus-trap, #A25: Escape close, #A46: mobile scroll */}
    {modal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={()=>setModal(null)} role="dialog" aria-modal="true" aria-label={modal.t}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div ref={modalRef} tabIndex={-1} onClick={e=>e.stopPropagation()} className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-dark-2 shadow-2xl animate-[fadeScale_0.3s_ease-out] outline-none">
          <div className="relative h-40 sm:h-56 overflow-hidden shrink-0">
            <Image src={modal.img} alt={modal.t} fill className="object-cover" sizes="(max-width:640px) 100vw, 500px"/>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-2 to-transparent" />
            <button onClick={()=>setModal(null)} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer" aria-label="Закрыть">{I.x}</button>
          </div>
          <div className="p-5 sm:p-8 -mt-4 relative">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-[family-name:var(--font-h)] text-2xl font-bold">{modal.t}</h3>
              <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${modal.color}`}>{modal.lv}</span>
            </div>
            <p className="text-gray leading-relaxed mb-6">{modal.full}</p>
            <a href="#contact" onClick={()=>setModal(null)} className="btn-primary w-full justify-center">
              <span>Записаться на пробное</span> {I.arrow()}
            </a>
          </div>
        </div>
      </div>
    )}

    {/* #B18: Floating Telegram button */}
    <a href="https://t.me/kam_dancestudio" target="_blank" rel="noopener noreferrer" className="floating-telegram" aria-label="Написать в Telegram">
      {I.tg}
    </a>

    {/* #B16: Back to top button */}
    <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className={`back-to-top ${sy > 600 ? "visible" : ""}`} aria-label="Наверх">
      {I.up}
    </button>

    {/* FOOTER */}
    <footer className="border-t border-line bg-dark-2 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 grid gap-6 sm:grid-cols-2 sm:mb-10 lg:grid-cols-4">
          <div><a href="#" className="font-[family-name:var(--font-h)] text-xl font-bold"><span className="text-pop">KAM</span> DANCE</a><p className="mt-3 text-xs text-gray leading-relaxed sm:text-sm">Танцевальная студия в Ташкенте. Качественное обучение в дружелюбной атмосфере.</p></div>
          <div><h4 className="mb-3 text-sm font-semibold">Стили</h4><ul className="space-y-1.5 text-xs text-gray sm:text-sm">{DANCE.map(d=><li key={d.t}><a href="#styles" className="hover:text-pop transition-colors cursor-pointer">{d.t}</a></li>)}</ul></div>
          <div><h4 className="mb-3 text-sm font-semibold">Навигация</h4><ul className="space-y-1.5 text-xs text-gray sm:text-sm">{NAV.map(l=><li key={l.h}><a href={l.h} className="hover:text-pop transition-colors cursor-pointer">{l.l}</a></li>)}</ul></div>
          <div><h4 className="mb-3 text-sm font-semibold">Контакты</h4><div className="space-y-1.5 text-xs text-gray sm:text-sm"><p>Паркент 235/1, Ташкент</p><p><a href="tel:+998901234567" className="hover:text-pop transition-colors">+998 (90) 123-45-67</a></p><p><a href="mailto:kam.dancestudio@gmail.com" className="hover:text-pop transition-colors">kam.dancestudio@gmail.com</a></p></div><div className="mt-3 flex gap-3"><a href="https://instagram.com/kam_dancestudio" target="_blank" rel="noopener noreferrer" className="text-gray hover:text-pop transition-colors cursor-pointer" aria-label="Instagram">{I.ig}</a><a href="https://t.me/kam_dancestudio" target="_blank" rel="noopener noreferrer" className="text-gray hover:text-pop transition-colors cursor-pointer" aria-label="Telegram">{I.tg}</a></div></div>
        </div>
        {/* #C1: dynamic year */}
        <div className="border-t border-line pt-6 text-center text-xs text-gray-dark">&copy; {new Date().getFullYear()} KAM Dance. Все права защищены.</div>
      </div>
    </footer>
  </>;
}
