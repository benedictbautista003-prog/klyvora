/* ============================================================
   Klyvora - shared prototype script
   Vanilla JavaScript only. No frameworks, no backend, no storage.

   Every view (home, dashboard, study topics, post details, create/edit,
   profile, bookmarks and about) is a <template> in this single file and is
   mounted into #view by the hash router at the bottom of this script.
   Demo state lives in memory and is mirrored into sessionStorage so that it
   survives moving between views. sessionStorage is discarded whenever the
   page is reloaded or the tab is closed, so a refresh always restarts the
   demo from the sample content. Nothing is ever written to localStorage.
   ============================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. Sample content (fictional)
     --------------------------------------------------------- */

  const TOPICS = [
    {
      id: 'programming',
      name: 'Programming',
      icon: '</>',
      description: 'Code, debugging and small projects - from your first function to your first bigger build.'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: '\u2211',
      description: 'Problem solving, proofs and the number sense that makes exams less frightening.'
    },
    {
      id: 'science',
      name: 'Science',
      icon: '\u2206',
      description: 'Physics, chemistry and biology, plus lab habits that make revision much easier.'
    },
    {
      id: 'language-writing',
      name: 'Language & Writing',
      icon: '\u00b6',
      description: 'Essays, grammar, vocabulary and expressing an idea clearly in writing.'
    },
    {
      id: 'study-techniques',
      name: 'Study Techniques',
      icon: '\u2713',
      description: 'Practical methods for remembering more in less time, with less stress.'
    },
    {
      id: 'academic-tips',
      name: 'General Academic Tips',
      icon: '\u2605',
      description: 'The everyday skills that keep a term running smoothly from week one to exams.'
    }
  ];

  const DEFAULT_PROFILE = {
    displayName: 'Alex Morgan',
    username: 'alex.learns',
    bio: 'Second-year student prototyping Klyvora. I collect study tricks from classmates and write them down before I forget them.'
  };

  const SAMPLE_POSTS = [
    {
      id: 'p1',
      title: 'How I Finally Understood Recursion',
      category: 'Programming',
      author: 'Maya Okafor',
      date: '2026-03-12',
      likes: 42,
      content:
        'For months recursion felt like magic. I could copy an example, but I could not write one. The turning point was a single sentence from a teaching assistant: a recursive function is just a function that solves a smaller version of the same problem and trusts itself to finish the job.\n\n' +
        'I started tracing every call on paper. I drew one box per call, wrote the arguments inside it, and drew an arrow to the box created by the next call. Seeing the stack as physical boxes made the base case obvious: the moment a box appears that the function already knows how to answer, the arrows start going back up.\n\n' +
        'My advice is to write three recursive functions by hand every week: sum a list, reverse a string, walk a folder tree. Do not look anything up until the paper version works. The pattern sticks much faster than re-reading a chapter.'
    },
    {
      id: 'p2',
      title: 'Writing Clean Functions: Three Habits That Stick',
      category: 'Programming',
      author: 'Daniel Reyes',
      date: '2026-02-27',
      likes: 31,
      content:
        'Clean code advice is usually a list of twenty rules, which is why nobody follows it. I kept only three habits and my code reviews became noticeably friendlier.\n\n' +
        'First, name things for what they mean, not what they are. A variable called pendingSubmissions tells the next reader more than list2 ever will. Second, keep a function short enough to read on one screen; if it does not fit, it is usually doing two jobs. Third, return early instead of nesting. Guard clauses at the top remove most of the indentation that makes code feel complicated.\n\n' +
        'None of this requires a style guide or special tools. It is just the difference between code you can re-read next month and code you have to decode.'
    },
    {
      id: 'p3',
      title: "A Beginner's Roadmap Through JavaScript Events",
      category: 'Programming',
      author: 'Priya Nandakumar',
      date: '2026-02-11',
      likes: 27,
      content:
        'Events confused me because tutorials jump straight to frameworks. If you are learning the browser by itself, there are really only four ideas you need: an event happens, a listener hears it, a handler runs, and the event may travel up the page.\n\n' +
        'The trick that made it click was printing the event object. Every time my handler ran I logged event.type and event.target. Suddenly I could see which element was actually clicked, which is often not the one I attached the listener to.\n\n' +
        'Once that felt natural, I learned one pattern that removed a lot of repeated code: attach a single listener to a container and check the target inside the handler. It is the same delegation trick used by big libraries, and it works in about five lines.'
    },
    {
      id: 'p4',
      title: 'A Debugging Checklist I Use Before Asking For Help',
      category: 'Programming',
      author: 'Tobias Lindqvist',
      date: '2026-01-30',
      likes: 19,
      content:
        'Asking for help is fine, but arriving with "it does not work" wastes everyone\'s time. I keep a short checklist and it usually solves the problem before I finish it.\n\n' +
        'Read the error message out loud, all of it. Check the line number it points to and the line above it. Confirm the code you are editing is the code that is running. Print the value you assume is correct, because assumptions are where bugs hide.\n\n' +
        'If the checklist fails, I write down three things: what I expected, what happened, and the smallest example that shows it. Half the time, writing the small example makes the answer obvious. The other half, I have a question my tutor can actually answer in one reply.'
    },
    {
      id: 'p5',
      title: 'Turning Word Problems Into Equations',
      category: 'Mathematics',
      author: 'Aisha Bello',
      date: '2026-03-05',
      likes: 35,
      content:
        'Word problems stopped being scary the day I stopped reading them as stories. A story has mood and detail; a word problem is a small set of quantities connected by relationships, wrapped in sentences to make it look friendly.\n\n' +
        'My method is mechanical. I underline every quantity and write it with a symbol and a unit. I circle every comparison word: twice, more than, per hour, in total. Then I write one short equation per comparison before trying to solve anything. Most mistakes I used to make came from solving too early.\n\n' +
        'Finally I check the answer against the original sentence. If a train is travelling forty kilometres an hour, six hundred kilometres per hour is a red flag. Units are the cheapest error detector in mathematics.'
    },
    {
      id: 'p6',
      title: 'Why Learning Proofs Changed My Math Grades',
      category: 'Mathematics',
      author: 'Chen Wei',
      date: '2026-02-18',
      likes: 24,
      content:
        'I used to treat proofs as extra work to memorise. Then I noticed that the students who did well in exams rarely memorised anything - they just knew why each step was allowed.\n\n' +
        'So I changed how I take notes. For every theorem I write three lines: what it claims, why it must be true, and one example where it fails if you remove a condition. That third line is the one that stays in my memory, because a broken counterexample is much easier to remember than an abstract statement.\n\n' +
        'It slowed me down at first, and then it sped me up. In the exam I stopped freezing on unfamiliar questions, because most of them are a known idea wearing a new hat.'
    },
    {
      id: 'p7',
      title: 'A Five-Minute Mental Math Warm-Up',
      category: 'Mathematics',
      author: 'Sofia Marchetti',
      date: '2026-01-22',
      likes: 17,
      content:
        'Before starting a maths session I spend five minutes on arithmetic I can almost do without thinking: percentages, fractions of round numbers, and estimating products. It sounds trivial, and it genuinely warms up the part of my brain that later handles algebra.\n\n' +
        'My routine is simple. Ten percent and five percent of numbers, then a handful of fraction-to-decimal conversions, then four estimation questions where I only need the right order of magnitude. I do it in my head, on the walk to the library, with no app and no timer.\n\n' +
        'The unexpected benefit is calm. When the basic numbers flow, a new topic feels like a puzzle rather than a threat.'
    },
    {
      id: 'p8',
      title: 'Active Recall for Biology Diagrams',
      category: 'Science',
      author: 'Hannah Weber',
      date: '2026-03-18',
      likes: 38,
      content:
        'Re-reading a labelled diagram is the most comfortable way to study biology and also the least effective. The comfortable feeling is recognition, not recall, and exams ask for recall.\n\n' +
        'My replacement is blank paper. I draw the diagram from memory, label it, then compare against the book using a different colour pen. Every label I missed goes on a short list that I retest two days later. Ten minutes of this beats an hour of highlighting.\n\n' +
        'I keep the diagrams grouped by system so I can also practise the connections between them - how breathing affects blood chemistry, for example. Cause and effect questions are where the marks hide.'
    },
    {
      id: 'p9',
      title: 'Keeping a Lab Notebook That Actually Helps You Revise',
      category: 'Science',
      author: 'Omar Haddad',
      date: '2026-02-02',
      likes: 21,
      content:
        'A lab notebook is normally written for the marker. That is why nobody can revise from it later. I added two small boxes to every practical write-up and it changed everything.\n\n' +
        'The first box is "what surprised me" - one or two sentences about something that did not match my expectation. The second is "if I repeated this" - the single change I would make next time. Both take under a minute and both turn a procedure into understanding.\n\n' +
        'At revision time I only read the boxes first. If a box reminds me of the method, I move on. If it does not, that experiment needs another look.'
    },
    {
      id: 'p10',
      title: 'Explaining Physics Concepts Out Loud',
      category: 'Science',
      author: 'Luis Ferreira',
      date: '2026-01-14',
      likes: 15,
      content:
        'Physics punishes quiet nodding. I used to read a chapter, agree with it, and then fail to explain it a week later. The fix was embarrassingly simple: I explain each concept out loud to an empty room, in plain language, without equations.\n\n' +
        'If I cannot do it without hedging, I have found the hole in my understanding. Usually it is a definition I glossed over, or a direction I assumed. Then I allow myself to reopen the book, fill the gap, and try again from the beginning.\n\n' +
        'I record two-minute explanations on my phone and listen back before an exam. Hearing yesterday-me be confused about momentum is far more memorable than re-reading the same page a fifth time.'
    },
    {
      id: 'p11',
      title: 'Building an Essay Outline in Ten Minutes',
      category: 'Language & Writing',
      author: 'Grace Mbeki',
      date: '2026-03-02',
      likes: 29,
      content:
        'The blank page is only intimidating because it asks for perfect sentences before you have decided what you think. An outline removes that pressure by separating thinking from writing.\n\n' +
        'I give myself ten minutes and four lines: the claim, three reasons, one counterargument. Each reason gets a single sentence of evidence and a rough word count. If a reason cannot survive one sentence of evidence, it is not a reason yet and it does not belong in the essay.\n\n' +
        'Only then do I write prose. Because the argument is already decided, drafting becomes translation, and I stop rewriting the introduction fifteen times.'
    },
    {
      id: 'p12',
      title: 'Ten Small Word Choices That Improve Academic Writing',
      category: 'Language & Writing',
      author: 'Jonas Berg',
      date: '2026-02-08',
      likes: 18,
      content:
        'Academic writing does not need bigger words, it needs more precise ones. A handful of swaps carry most of the improvement.\n\n' +
        '"Very important" becomes "significant". "A lot of" becomes "numerous" or, better, an actual number. "Because of the fact that" becomes "because". "In order to" becomes "to". "Therefore" and "however" earn their place only where the logic actually turns. Cut "basically", "really" and "quite" unless they carry meaning.\n\n' +
        'I keep this list beside me while editing, not while drafting, so that the first version can be careless and the second version can be sharp.'
    },
    {
      id: 'p13',
      title: 'The 25/5 Study Block, Explained Simply',
      category: 'Study Techniques',
      author: 'Ravi Menon',
      date: '2026-03-22',
      likes: 46,
      content:
        'Treating study time as one long vague block is why four hours can produce twenty minutes of work. Splitting it into short, defined blocks with real breaks fixed that for me.\n\n' +
        'One block is twenty-five minutes on a single named task, then five minutes away from the screen: stand up, refill water, look out of a window. After four blocks I take a longer break. The whole system fits on an index card, and the only rule that matters is that a block has one task and a visible finish line.\n\n' +
        'I also write down what I finished at the end of each block. A page of finished blocks is a much better measure of a day than the number of hours I spent sitting at a desk.'
    },
    {
      id: 'p14',
      title: 'Spaced Repetition Without Expensive Apps',
      category: 'Study Techniques',
      author: 'Elena Petrova',
      date: '2026-02-14',
      likes: 33,
      content:
        'Spaced repetition is just reviewing material at growing intervals, and you can run it with paper. I use a shoebox of index cards with four divider tabs: day one, day three, day seven, day twenty-one.\n\n' +
        'Each card holds one question on the front and the answer on the back. When I get a card right it moves to the next tab; when I get it wrong it goes back to day one. Ten minutes a day, one pass through todays tab.\n\n' +
        'The important part is writing the questions, not the reviewing. Turning a chapter into questions forces you to decide what actually matters, which is most of the studying already done.'
    },
    {
      id: 'p15',
      title: 'How a Weekly Review Saved My Semester',
      category: 'Study Techniques',
      author: 'Nadia Farouk',
      date: '2026-01-26',
      likes: 22,
      content:
        'I used to plan once at the start of term and then drift. Twenty minutes every Sunday changed that more than any productivity app.\n\n' +
        'The review has four questions: what is due next week, what did I avoid this week, what do I need to ask someone about, and what will I do first on Monday morning. Answers are written by hand in one page, then closed.\n\n' +
        'Writing it down matters because vague worry feels like work while producing nothing. A page with four honest answers turns the week ahead into a short list instead of a cloud.'
    },
    {
      id: 'p16',
      title: 'Talking to Your Tutor Without Feeling Awkward',
      category: 'General Academic Tips',
      author: 'Marcus Cole',
      date: '2026-03-09',
      likes: 25,
      content:
        'Most students avoid office hours because they fear looking behind. In practice tutors spend their day hoping someone will ask something specific.\n\n' +
        'Go in with one question you have already attempted and one sentence about where you got stuck. Bring the work itself, even if it is wrong. If the explanation does not land, say so immediately - that is useful information, not rudeness.\n\n' +
        'Before leaving, summarise the answer back in your own words. If you can do that without notes, you will not need to ask the same question again.'
    },
    {
      id: 'p17',
      title: 'Study Groups That Actually Stay On Track',
      category: 'General Academic Tips',
      author: 'Yuki Tanaka',
      date: '2026-02-20',
      likes: 20,
      content:
        'A study group with no structure becomes a social hour with textbooks open. Our group of four fixed that with three rules.\n\n' +
        'Everyone arrives with one prepared question. The first twenty minutes are silent independent work, so nobody free-rides on the discussion. The last ten minutes are for deciding next weeks topic and who brings what.\n\n' +
        'We also keep the group small. Four people can all speak; eight people cannot. Since we changed this, I leave every session with something written down rather than just a nice afternoon.'
    }
  ];

  const SAMPLE_COMMENTS = {
    p1: [
      { author: 'Priya Nandakumar', mine: false, date: '2026-03-13', text: 'The paper tracing tip is the one that finally worked for me too. Drawing the stack makes the base case obvious.' },
      { author: 'Tobias Lindqvist', mine: false, date: '2026-03-15', text: 'Adding the folder tree exercise to my practice list. Thanks for writing this up so plainly.' }
    ],
    p5: [
      { author: 'Sofia Marchetti', mine: false, date: '2026-03-06', text: 'Writing an equation for every comparison before solving anything is exactly where I lose marks. Trying this next week.' }
    ],
    p8: [
      { author: 'Omar Haddad', mine: false, date: '2026-03-19', text: 'The different colour pen idea is clever - it makes the gaps visually obvious without extra work.' },
      { author: 'Luis Ferreira', mine: false, date: '2026-03-21', text: 'I do the same with physics diagrams. Blank paper first, book second. The difference in recall is real.' }
    ],
    p13: [
      { author: 'Nadia Farouk', mine: false, date: '2026-03-23', text: 'Naming the task before starting a block is the part I always skipped. That is probably why it never worked for me.' }
    ]
  };

  /* ---------------------------------------------------------
     2. Demo state
     --------------------------------------------------------- */

  const STORAGE_KEY = 'klyvora.demo.v1';

  function seedState() {
    return {
      posts: SAMPLE_POSTS.map(function (post) {
        return {
          id: post.id,
          title: post.title,
          category: post.category,
          author: post.author,
          date: post.date,
          likes: post.likes,
          content: post.content,
          isMine: false
        };
      }),
      comments: JSON.parse(JSON.stringify(SAMPLE_COMMENTS)),
      likedIds: [],
      bookmarkedIds: [],
      profile: Object.assign({}, DEFAULT_PROFILE),
      nextId: 1
    };
  }

  /* A reload (F5 / browser refresh) always restarts the demo. */
  function wasReloaded() {
    try {
      const entries = performance.getEntriesByType('navigation');
      if (entries && entries.length) return entries[0].type === 'reload';
      if (performance.navigation) return performance.navigation.type === 1;
    } catch (error) {
      /* Navigation Timing is not available in every environment. */
    }
    return false;
  }

  let memoryState = null; /* fallback when sessionStorage is unavailable */

  function persist(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      /* Ignored on purpose: persistence across pages is a convenience only. */
    }
  }

  function loadState() {
    if (wasReloaded()) {
      memoryState = seedState();
      persist(memoryState);
      return memoryState;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.posts)) {
          memoryState = parsed;
          return memoryState;
        }
      }
    } catch (error) {
      /* sessionStorage can be blocked; the site still works in memory. */
    }
    if (memoryState) return memoryState;
    memoryState = seedState();
    persist(memoryState);
    return memoryState;
  }

  const state = loadState();

  function notifyChange(reason) {
    syncToggleButtons(document);
    changeListeners.forEach(function (handler) {
      try {
        handler(reason);
      } catch (error) {
        /* One broken view should never stop the others from updating. */
      }
    });
    updateSummaryCounts();
  }

  function saveState(reason) {
    memoryState = state;
    persist(state);
    notifyChange(reason);
  }

  function resetDemo() {
    const fresh = seedState();
    Object.keys(fresh).forEach(function (key) {
      state[key] = fresh[key];
    });
    saveState('reset');
  }

  /* ---------------------------------------------------------
     3. Small helpers
     --------------------------------------------------------- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Every view lives in this one document, so page parameters travel in the
     hash (for example #/post?id=p1) instead of the query string. */
  const ROUTES = ['home', 'dashboard', 'topics', 'post', 'create-post', 'profile', 'bookmarks', 'about'];

  const PAGE_MODULES = {
    home: 'home',
    dashboard: 'dashboard',
    topics: 'topics',
    post: 'post',
    'create-post': 'createPost',
    profile: 'profile',
    bookmarks: 'bookmarks',
    about: 'about'
  };

  const PAGE_TITLES = {
    home: 'Klyvora \u2014 student knowledge sharing',
    dashboard: 'Dashboard \u2014 Klyvora',
    topics: 'Study topics \u2014 Klyvora',
    post: 'Post \u2014 Klyvora',
    'create-post': 'Create post \u2014 Klyvora',
    profile: 'Profile \u2014 Klyvora',
    bookmarks: 'Bookmarks \u2014 Klyvora',
    about: 'About \u2014 Klyvora'
  };

  function currentRoute() {
    const raw = String(window.location.hash || '').replace(/^#\/?/, '');
    const pieces = raw.split('?');
    const requested = (pieces[0] || '').replace(/\/+$/, '');
    let params;
    try {
      params = new URLSearchParams(pieces[1] || '');
    } catch (error) {
      params = new URLSearchParams('');
    }
    return {
      name: ROUTES.indexOf(requested) === -1 ? 'home' : requested,
      requested: requested,
      params: params
    };
  }

  function routeHref(name, query) {
    return '#/' + name + (query ? '?' + query : '');
  }

  function routeNameOf(href) {
    const match = /^#\/?([a-z-]*)/.exec(String(href == null ? '' : href));
    if (!match) return '';
    const name = match[1] || 'home';
    return ROUTES.indexOf(name) === -1 ? '' : name;
  }

  function navigate(name, query) {
    const target = routeHref(name, query);
    if (window.location.hash === target) {
      renderRoute();
    } else {
      window.location.hash = target;
    }
  }

  function getParam(name) {
    try {
      return currentRoute().params.get(name) || '';
    } catch (error) {
      return '';
    }
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function todayISO() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return now.getFullYear() + '-' + month + '-' + day;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const parts = String(iso).slice(0, 10).split('-');
    if (parts.length !== 3) return String(iso);
    const monthIndex = Number(parts[1]) - 1;
    if (monthIndex < 0 || monthIndex > 11) return String(iso);
    return Number(parts[2]) + ' ' + MONTHS[monthIndex] + ' ' + parts[0];
  }

  function excerpt(text, length) {
    const max = length || 150;
    const flat = String(text).replace(/\s+/g, ' ').trim();
    if (flat.length <= max) return flat;
    return flat.slice(0, max).replace(/\s+\S*$/, '') + '\u2026';
  }

  function paragraphs(text) {
    return String(text)
      .split(/\n\s*\n/)
      .map(function (block) { return '<p>' + esc(block.trim()) + '</p>'; })
      .join('');
  }

  function initials(name) {
    const letters = String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0).toUpperCase(); })
      .join('');
    return letters || '?';
  }

  function topicName(id) {
    const topic = TOPICS.filter(function (item) { return item.id === id; })[0];
    return topic ? topic.name : '';
  }

  function topicDescription(name) {
    const topic = TOPICS.filter(function (item) { return item.name === name; })[0];
    return topic ? topic.description : '';
  }

  function findPost(id) {
    return state.posts.filter(function (post) { return post.id === id; })[0] || null;
  }

  function postsInCategory(name) {
    return state.posts.filter(function (post) { return post.category === name; });
  }

  function commentsFor(id) {
    if (!Array.isArray(state.comments[id])) state.comments[id] = [];
    return state.comments[id];
  }

  function totalComments() {
    return Object.keys(state.comments).reduce(function (sum, key) {
      return sum + commentsFor(key).length;
    }, 0);
  }

  function isLiked(id) { return state.likedIds.indexOf(id) !== -1; }
  function isBookmarked(id) { return state.bookmarkedIds.indexOf(id) !== -1; }
  function likeCount(post) { return post.likes + (isLiked(post.id) ? 1 : 0); }

  function authorOf(comment) {
    return comment.mine ? state.profile.displayName : comment.author;
  }

  function postsSorted() {
    return state.posts.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
  }

  function matches(post, query, category) {
    if (category && category !== 'All' && post.category !== category) return false;
    const needle = String(query || '').trim().toLowerCase();
    if (!needle) return true;
    return [post.title, post.content, post.category, post.author]
      .join(' ')
      .toLowerCase()
      .indexOf(needle) !== -1;
  }

  function filterPosts(options) {
    const query = (options && options.query) || '';
    const category = (options && options.category) || 'All';
    return postsSorted().filter(function (post) { return matches(post, query, category); });
  }

  /* ---------------------------------------------------------
     4. Reusable markup
     --------------------------------------------------------- */

  const ICONS = {
    heart: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3 4.9 13.4a4.4 4.4 0 0 1 6.2-6.2l.9.9.9-.9a4.4 4.4 0 0 1 6.2 6.2Z"/></svg>',
    bookmark: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 3h11a1 1 0 0 1 1 1v16.5l-6.5-4-6.5 4V4a1 1 0 0 1 1-1Z"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><line x1="16" y1="16" x2="21" y2="21"/></svg>'
  };

  function likeButton(post, extraClass) {
    const liked = isLiked(post.id);
    return '' +
      '<button type="button" class="icon-btn js-like' + (liked ? ' is-active' : '') + (extraClass ? ' ' + extraClass : '') + '"' +
      ' data-id="' + esc(post.id) + '" aria-pressed="' + (liked ? 'true' : 'false') + '">' +
      ICONS.heart +
      '<span aria-hidden="true" class="js-like-count">' + likeCount(post) + '</span>' +
      '<span class="sr-only js-like-text">' + (liked ? 'Remove your like from ' : 'Like ') + esc(post.title) + '</span>' +
      '</button>';
  }

  function bookmarkButton(post, extraClass) {
    const saved = isBookmarked(post.id);
    return '' +
      '<button type="button" class="icon-btn js-bookmark' + (saved ? ' is-active' : '') + (extraClass ? ' ' + extraClass : '') + '"' +
      ' data-id="' + esc(post.id) + '" aria-pressed="' + (saved ? 'true' : 'false') + '">' +
      ICONS.bookmark +
      '<span aria-hidden="true" class="js-bookmark-label">' + (saved ? 'Saved' : 'Save') + '</span>' +
      '<span class="sr-only js-bookmark-text">' + (saved ? 'Remove bookmark from ' : 'Bookmark ') + esc(post.title) + '</span>' +
      '</button>';
  }

  function postCard(post) {
    const topic = TOPICS.filter(function (item) { return item.name === post.category; })[0];
    return '' +
      '<article class="post-card" data-post-id="' + esc(post.id) + '">' +
        '<div class="meta">' +
          '<span class="badge">' + esc(post.category) + '</span>' +
          (post.isMine ? '<span class="badge badge--mine">Your post</span>' : '') +
          '<span class="meta__dot" aria-hidden="true">&middot;</span>' +
          '<span>' + formatDate(post.date) + '</span>' +
        '</div>' +
        '<h3 class="post-card__title"><a href="#/post?id=' + encodeURIComponent(post.id) + '">' + esc(post.title) + '</a></h3>' +
        '<p class="post-card__excerpt">' + esc(excerpt(post.content)) + '</p>' +
        '<div class="post-card__footer">' +
          '<span>' + esc(post.author) + '</span>' +
          '<div class="post-card__actions">' +
            likeButton(post) +
            bookmarkButton(post) +
          '</div>' +
        '</div>' +
        (topic ? '<p class="small muted mb-0"><a href="#/topics?topic=' + encodeURIComponent(topic.id) + '">More in ' + esc(post.category) + '</a></p>' : '') +
      '</article>';
  }

  function emptyState(options) {
    return '' +
      '<div class="empty">' +
        '<div class="empty__icon" aria-hidden="true">' + (options.icon || '\u2630') + '</div>' +
        '<h3>' + esc(options.title) + '</h3>' +
        '<p>' + esc(options.message) + '</p>' +
        (options.actionHref
          ? '<a class="btn" href="' + esc(options.actionHref) + '">' + esc(options.actionLabel || 'Continue') + '</a>'
          : '') +
      '</div>';
  }

  function commentItem(comment) {
    return '' +
      '<li class="comment">' +
        '<div class="comment__head">' +
          '<span class="avatar" aria-hidden="true">' + esc(initials(authorOf(comment))) + '</span>' +
          '<strong>' + esc(authorOf(comment)) + '</strong>' +
          '<time datetime="' + esc(comment.date) + '">' + formatDate(comment.date) + '</time>' +
        '</div>' +
        '<p>' + esc(comment.text) + '</p>' +
      '</li>';
  }

  /* ---------------------------------------------------------
     5. Change notification
     --------------------------------------------------------- */

  const changeListeners = [];

  function onChange(handler) {
    changeListeners.push(handler);
  }

  /* Pages only rebuild their lists when the change can actually alter the
     list itself. Likes and bookmarks are synced in place by
     syncToggleButtons(), which keeps the clicked control focused. */
  function shouldRerender(reason, extraReasons) {
    const structural = ['create', 'edit', 'delete', 'reset'];
    if (reason === undefined) return true;
    return structural.indexOf(reason) !== -1 || (extraReasons || []).indexOf(reason) !== -1;
  }

  /* Keeps every like / bookmark control in sync with the demo state. */
  function syncToggleButtons(root) {
    const scope = root || document;
    scope.querySelectorAll('.js-like').forEach(function (button) {
      const id = button.getAttribute('data-id');
      const post = findPost(id);
      if (!post) return;
      const liked = isLiked(id);
      button.classList.toggle('is-active', liked);
      button.setAttribute('aria-pressed', liked ? 'true' : 'false');
      const count = button.querySelector('.js-like-count');
      if (count) count.textContent = String(likeCount(post));
      const text = button.querySelector('.js-like-text');
      if (text) text.textContent = (liked ? 'Remove your like from ' : 'Like ') + post.title;
    });

    scope.querySelectorAll('.js-bookmark').forEach(function (button) {
      const id = button.getAttribute('data-id');
      const post = findPost(id);
      if (!post) return;
      const saved = isBookmarked(id);
      button.classList.toggle('is-active', saved);
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      const label = button.querySelector('.js-bookmark-label');
      if (label) label.textContent = saved ? 'Saved' : 'Save';
      const text = button.querySelector('.js-bookmark-text');
      if (text) text.textContent = (saved ? 'Remove bookmark from ' : 'Bookmark ') + post.title;
    });
  }

  let liveRegion = null;

  /* Small live region that reports interactions to screen readers. */
  function announce(message) {
    if (!liveRegion) {
      liveRegion = document.createElement('p');
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  }

  function toggleLike(id) {
    if (!findPost(id)) return;
    const index = state.likedIds.indexOf(id);
    if (index === -1) {
      state.likedIds.push(id);
    } else {
      state.likedIds.splice(index, 1);
    }
    saveState('like');
    announce(index === -1 ? 'Post liked.' : 'Like removed.');
  }

  function toggleBookmark(id) {
    if (!findPost(id)) return;
    const index = state.bookmarkedIds.indexOf(id);
    const saved = index === -1;
    if (saved) {
      state.bookmarkedIds.push(id);
    } else {
      state.bookmarkedIds.splice(index, 1);
    }
    saveState('bookmark');
    announce(saved ? 'Added to your bookmarks.' : 'Removed from your bookmarks.');
  }

  function deletePost(id) {
    const post = findPost(id);
    if (!post || !post.isMine) return false;
    const ok = window.confirm('Delete "' + post.title + '"? This removes the post, its comments and its bookmarks from this demo session.');
    if (!ok) return false;
    state.posts = state.posts.filter(function (item) { return item.id !== id; });
    delete state.comments[id];
    state.likedIds = state.likedIds.filter(function (item) { return item !== id; });
    state.bookmarkedIds = state.bookmarkedIds.filter(function (item) { return item !== id; });
    saveState('delete');
    announce('Post deleted.');
    return true;
  }

  /* ---------------------------------------------------------
     6. Shared page chrome (navigation, footer, global controls)
     --------------------------------------------------------- */

  function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      /* The menu is a panel on small screens, so close it once it is used. */
      nav.addEventListener('click', function (event) {
        if (event.target.closest('a') && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* Marks the view that is currently on screen in the header and footer nav. */
  function markCurrentNav() {
    const current = currentRoute().name;
    document.querySelectorAll('.main-nav a, .sidebar nav a, [data-nav-link]').forEach(function (link) {
      if (routeNameOf(link.getAttribute('href')) === current) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* A link back to the view you are already on still remounts it, which is
     what a real page load would do. */
  function initRouteLinks() {
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#/"]');
      if (!link) return;
      if (link.getAttribute('href') === window.location.hash) {
        event.preventDefault();
        renderRoute();
      }
    });
  }

  function initResetControls() {
    document.querySelectorAll('.js-reset-demo').forEach(function (button) {
      button.addEventListener('click', function () {
        if (window.confirm('Restart the demo? Created posts, comments, likes and bookmarks will be cleared.')) {
          resetDemo();
          announce('Demo restarted with the original sample content.');
        }
      });
    });
  }

  function initGlobalActions() {
    document.addEventListener('click', function (event) {
      const like = event.target.closest('.js-like');
      if (like) {
        event.preventDefault();
        toggleLike(like.getAttribute('data-id'));
        return;
      }
      const bookmark = event.target.closest('.js-bookmark');
      if (bookmark) {
        event.preventDefault();
        toggleBookmark(bookmark.getAttribute('data-id'));
        return;
      }
      const remove = event.target.closest('.js-remove-bookmark');
      if (remove) {
        event.preventDefault();
        toggleBookmark(remove.getAttribute('data-id'));
        return;
      }
      const del = event.target.closest('.js-delete-post');
      if (del) {
        event.preventDefault();
        if (deletePost(del.getAttribute('data-id'))) {
          navigate('dashboard');
        }
      }
    });
  }

  /* Summary counters used on the home, dashboard and about pages. */
  function updateSummaryCounts() {
    const map = {
      'stat-posts': state.posts.length,
      'stat-topics': TOPICS.length,
      'stat-comments': totalComments(),
      'stat-mine': state.posts.filter(function (post) { return post.isMine; }).length,
      'stat-bookmarks': state.bookmarkedIds.filter(findPost).length,
      'stat-likes': state.likedIds.filter(findPost).length,
      'stat-my-comments': Object.keys(state.comments).reduce(function (total, key) {
        return total + commentsFor(key).filter(function (comment) { return comment.mine; }).length;
      }, 0)
    };
    Object.keys(map).forEach(function (id) {
      const node = document.getElementById(id);
      if (node) node.textContent = String(map[id]);
    });
  }

  /* ---------------------------------------------------------
     7. Shared search + category filter control
     --------------------------------------------------------- */

  function chipRowHTML() {
    const chips = ['All'].concat(TOPICS.map(function (topic) { return topic.name; }));
    return chips.map(function (name) {
      return '<button type="button" class="chip" data-category="' + esc(name) + '" aria-pressed="' +
        (name === 'All' ? 'true' : 'false') + '">' + esc(name) + '</button>';
    }).join('');
  }

  function toolbarHTML(options) {
    return '' +
      '<div class="toolbar">' +
        '<div class="toolbar__row">' +
          '<div class="search-field">' +
            '<label class="sr-only" for="' + esc(options.searchId) + '">' + esc(options.searchLabel) + '</label>' +
            ICONS.search +
            '<input type="search" id="' + esc(options.searchId) + '" placeholder="' + esc(options.placeholder) + '" autocomplete="off">' +
          '</div>' +
          '<div class="btn-group">' +
            '<button type="button" class="btn btn--ghost btn--sm is-hidden js-clear">Clear search</button>' +
          '</div>' +
        '</div>' +
        '<div class="chip-row" role="group" aria-label="Filter by study topic">' + chipRowHTML() + '</div>' +
        '<p class="result-count" role="status" id="' + esc(options.countId) + '"></p>' +
      '</div>';
  }

  function initFilterControl(options) {
    const input = document.querySelector(options.search);
    const clearBtn = document.querySelector(options.clear);
    const chipRow = document.querySelector(options.chips);
    const countNode = document.querySelector(options.count);
    const render = options.render;

    const current = {
      query: options.initialQuery || '',
      category: options.initialCategory || 'All'
    };

    if (input) input.value = current.query;

    function paint() {
      if (chipRow) {
        chipRow.querySelectorAll('.chip').forEach(function (chip) {
          chip.setAttribute('aria-pressed', chip.getAttribute('data-category') === current.category ? 'true' : 'false');
        });
      }
      if (clearBtn) clearBtn.classList.toggle('is-hidden', !current.query);
    }

    function run() {
      const results = render({ query: current.query, category: current.category });
      if (countNode) {
        const total = results ? results.length : 0;
        countNode.textContent = total + (total === 1 ? ' result' : ' results');
      }
      paint();
    }

    if (input) {
      input.addEventListener('input', function () {
        current.query = input.value;
        run();
      });
      input.addEventListener('search', function () {
        current.query = input.value;
        run();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        current.query = '';
        if (input) {
          input.value = '';
          input.focus();
        }
        run();
      });
    }

    if (chipRow) {
      chipRow.addEventListener('click', function (event) {
        const chip = event.target.closest('.chip');
        if (!chip) return;
        current.category = chip.getAttribute('data-category');
        run();
      });
    }

    onChange(function (reason) {
      if (shouldRerender(reason)) run();
    });
    run();

    return {
      state: current,
      refresh: run,
      setCategory: function (category) {
        current.category = category || 'All';
        run();
      },
      setQuery: function (query) {
        current.query = query || '';
        if (input) input.value = current.query;
        run();
      }
    };
  }

  /* ---------------------------------------------------------
     8. Page modules
     --------------------------------------------------------- */

  const pages = {};

  /* ---------- Page 1: Home ---------- */
  pages.home = function () {
    /* The hero search box asks the study topics view to do the searching. */
    const searchForm = document.getElementById('home-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const field = searchForm.querySelector('#home-search');
        const value = field ? field.value.trim() : '';
        navigate('topics', value ? 'q=' + encodeURIComponent(value) : '');
      });
    }

    const topicGrid = document.getElementById('home-topics');
    if (topicGrid) {
      topicGrid.innerHTML = TOPICS.slice(0, 3).map(function (topic) {
        const count = postsInCategory(topic.name).length;
        return '' +
          '<article class="topic-card">' +
            '<span class="topic-card__icon" aria-hidden="true">' + esc(topic.icon) + '</span>' +
            '<h3>' + esc(topic.name) + '</h3>' +
            '<p>' + esc(topic.description) + '</p>' +
            '<div class="topic-card__foot">' +
              '<span>' + count + (count === 1 ? ' post' : ' posts') + '</span>' +
              '<a href="#/topics?topic=' + esc(topic.id) + '">Browse topic</a>' +
            '</div>' +
          '</article>';
      }).join('');
    }

    const featured = document.getElementById('home-posts');
    if (featured) {
      const render = function () {
        const list = postsSorted().slice(0, 6);
        featured.innerHTML = list.length
          ? '<div class="grid grid--auto">' + list.map(postCard).join('') + '</div>'
          : emptyState({
              title: 'No posts yet',
              message: 'Create the first post in this demo session.',
              actionHref: '#/create-post',
              actionLabel: 'Create a post'
            });
      };
      render();
      onChange(function (reason) {
        if (shouldRerender(reason)) render();
      });
    }
  };

  /* ---------- Page 2: Dashboard ---------- */
  pages.dashboard = function () {
    const nameNode = document.getElementById('welcome-name');
    if (nameNode) nameNode.textContent = state.profile.displayName;

    const toolbar = document.getElementById('dashboard-toolbar');
    const results = document.getElementById('dashboard-results');

    function renderList(filters) {
      const list = filterPosts(filters);
      if (!list.length) {
        results.innerHTML = emptyState({
          title: 'No posts match your search',
          message: 'Try a different keyword or choose another study topic. You can also clear the search to see every post again.',
          actionHref: '#/topics',
          actionLabel: 'Browse study topics'
        });
        return list;
      }
      results.innerHTML = '<div class="grid grid--auto">' + list.map(postCard).join('') + '</div>';
      return list;
    }

    if (toolbar) {
      toolbar.innerHTML = toolbarHTML({
        searchId: 'dashboard-search',
        searchLabel: 'Search posts',
        placeholder: 'Search posts by title, content, topic or author',
        countId: 'dashboard-count'
      });
    }

    if (results) {
      initFilterControl({
        search: '#dashboard-search',
        clear: '#dashboard-toolbar .js-clear',
        chips: '#dashboard-toolbar .chip-row',
        count: '#dashboard-count',
        initialCategory: getParam('category') || 'All',
        initialQuery: getParam('q') || '',
        render: renderList
      });
    }

    const topicList = document.getElementById('dashboard-topics');
    if (topicList) {
      const render = function () {
        topicList.innerHTML = TOPICS.map(function (topic) {
          const count = postsInCategory(topic.name).length;
          return '' +
            '<li class="author-row">' +
              '<span class="avatar" aria-hidden="true" style="border-radius:8px">' + esc(topic.icon) + '</span>' +
              '<span style="flex:1">' +
                '<a href="#/topics?topic=' + esc(topic.id) + '"><strong>' + esc(topic.name) + '</strong></a>' +
                '<span>' + count + (count === 1 ? ' post' : ' posts') + '</span>' +
              '</span>' +
            '</li>';
        }).join('');
      };
      render();
      onChange(function (reason) {
        if (shouldRerender(reason)) render();
      });
    }

    const recent = document.getElementById('dashboard-recent');
    if (recent) {
      const render = function () {
        const list = postsSorted().slice(0, 4);
        recent.innerHTML = list.length
          ? list.map(function (post) {
              return '<li><span><a href="#/post?id=' + encodeURIComponent(post.id) + '">' + esc(post.title) + '</a>' +
                '<span class="muted small"> ' + esc(post.category) + ' &middot; ' + formatDate(post.date) + '</span></span></li>';
            }).join('')
          : '<li><span>No posts yet.</span></li>';
      };
      render();
      onChange(function (reason) {
        if (shouldRerender(reason)) render();
      });
    }

    const mine = document.getElementById('dashboard-mine');
    if (mine) {
      const render = function () {
        const own = state.posts.filter(function (post) { return post.isMine; });
        if (!own.length) {
          mine.innerHTML = '<p class="muted small mb-0">You have not created any posts in this session yet. ' +
            '<a href="#/create-post">Write your first post</a>.</p>';
        } else {
          mine.innerHTML = '<ul class="mini-list">' + own.map(function (post) {
            return '<li><span style="flex:1"><a href="#/post?id=' + encodeURIComponent(post.id) + '">' +
              esc(post.title) + '</a><span class="muted small"> ' + esc(post.category) + '</span></span>' +
              '<a class="btn btn--secondary btn--sm" href="#/create-post?edit=' + encodeURIComponent(post.id) + '">Edit</a></li>';
          }).join('') + '</ul>';
        }
      };
      render();
      onChange(function (reason) {
        if (shouldRerender(reason)) render();
      });
    }
  };

  /* ---------- Page 3: Study topics ---------- */
  pages.topics = function () {
    const toolbar = document.getElementById('topics-toolbar');
    const topicGrid = document.getElementById('topic-grid');
    const postResults = document.getElementById('topic-posts');
    if (!toolbar || !topicGrid || !postResults) return;

    toolbar.innerHTML = toolbarHTML({
      searchId: 'topics-search',
      searchLabel: 'Search topics and posts',
      placeholder: 'Search topics, posts, authors and content',
      countId: 'topics-count'
    });

    let filterApi = null;

    function renderTopicCards(filters) {
      const query = String(filters.query || '').toLowerCase().trim();
      const cards = TOPICS.filter(function (topic) {
        if (!query) return true;
        return (topic.name + ' ' + topic.description).toLowerCase().indexOf(query) !== -1;
      });

      if (!cards.length) {
        topicGrid.innerHTML = emptyState({
          title: 'No topics match your search',
          message: 'No study topic matches the current search. Clear the search to see all six topics again.',
          actionHref: '#/about',
          actionLabel: 'About Klyvora'
        });
        return;
      }

      topicGrid.innerHTML = '<div class="grid grid--auto">' + cards.map(function (topic) {
        const posts = postsInCategory(topic.name);
        const active = filters.category === topic.name;
        return '' +
          '<article class="topic-card"' + (active ? ' style="border-color:var(--primary)"' : '') + '>' +
            '<span class="topic-card__icon" aria-hidden="true">' + esc(topic.icon) + '</span>' +
            '<h3>' + esc(topic.name) + '</h3>' +
            '<p>' + esc(topic.description) + '</p>' +
            '<div class="topic-card__foot">' +
              '<span>' + posts.length + (posts.length === 1 ? ' post' : ' posts') + '</span>' +
              '<button type="button" class="btn btn--secondary btn--sm js-topic-select" data-topic-id="' + esc(topic.id) +
                '" aria-pressed="' + (active ? 'true' : 'false') + '">' +
                (active ? 'Showing posts' : 'Show posts') +
              '</button>' +
            '</div>' +
          '</article>';
      }).join('') + '</div>';
    }

    function renderPostList(filters) {
      const list = filterPosts(filters);
      const label = filters.category === 'All' ? 'All topics' : filters.category;
      if (!list.length) {
        postResults.innerHTML = '<h2>Posts in this view</h2>' + emptyState({
          title: 'No posts match your filters',
          message: 'Nothing matches the current search and topic combination. Try a broader keyword, or switch back to the All topics filter.',
          actionHref: '#/create-post',
          actionLabel: 'Write a post instead'
        });
      } else {
        postResults.innerHTML = '<h2>Posts in this view <span class="muted small">(' + esc(label) + ')</span></h2>' +
          '<div class="grid grid--auto">' + list.map(postCard).join('') + '</div>';
      }
      renderTopicCards(filters);
      return list;
    }

    filterApi = initFilterControl({
      search: '#topics-search',
      clear: '#topics-toolbar .js-clear',
      chips: '#topics-toolbar .chip-row',
      count: '#topics-count',
      initialCategory: getParam('category') || 'All',
      initialQuery: getParam('q') || '',
      render: renderPostList
    });

    const requestedTopic = topicName(getParam('topic'));
    if (requestedTopic) filterApi.setCategory(requestedTopic);

    topicGrid.addEventListener('click', function (event) {
      const button = event.target.closest('.js-topic-select');
      if (!button) return;
      const name = topicName(button.getAttribute('data-topic-id')) || 'All';
      filterApi.setCategory(filterApi.state.category === name ? 'All' : name);
      postResults.scrollIntoView({ block: 'start' });
    });
  };

  /* ---------- Page 4: Post details ---------- */
  pages.post = function () {
    const root = document.getElementById('post-root');
    if (!root) return;

    const id = getParam('id');

    if (!id) {
      root.innerHTML = emptyState({
        title: 'No post selected',
        message: 'This page needs a post reference. Pick a post from the dashboard or the study topics page to open its full details.',
        actionHref: '#/topics',
        actionLabel: 'Browse study topics'
      });
      return;
    }

    function render() {
      const post = findPost(id);
      if (!post) {
        root.innerHTML = emptyState({
          title: 'Post not found',
          message: 'The post you asked for does not exist in this demo session. It may have been deleted, or the link may be incomplete.',
          actionHref: '#/dashboard',
          actionLabel: 'Back to the dashboard'
        });
        return;
      }

      const comments = commentsFor(post.id);
      const related = postsInCategory(post.category).filter(function (item) { return item.id !== post.id; }).slice(0, 3);

      root.innerHTML = '' +
        '<article class="card">' +
          '<header class="post-header">' +
            '<div class="meta">' +
              '<a class="badge" href="#/topics?category=' + encodeURIComponent(post.category) + '">' + esc(post.category) + '</a>' +
              (post.isMine ? '<span class="badge badge--mine">Your post</span>' : '') +
              '<span class="meta__dot" aria-hidden="true">&middot;</span>' +
              '<span>Published ' + formatDate(post.date) + '</span>' +
              '<span class="meta__dot" aria-hidden="true">&middot;</span>' +
              '<span id="post-comment-count">' + comments.length + (comments.length === 1 ? ' comment' : ' comments') + '</span>' +
            '</div>' +
            '<h1>' + esc(post.title) + '</h1>' +
            '<div class="author-row">' +
              '<span class="avatar" aria-hidden="true">' + esc(initials(post.author)) + '</span>' +
              '<span><strong>' + esc(post.author) + '</strong><span>' + esc(topicDescription(post.category)) + '</span></span>' +
            '</div>' +
          '</header>' +
          '<div class="post-body">' + paragraphs(post.content) + '</div>' +
          '<div class="post-actions">' +
            likeButton(post) +
            bookmarkButton(post) +
            '<span class="spacer"></span>' +
            (post.isMine
              ? '<a class="btn btn--secondary btn--sm" href="#/create-post?edit=' + encodeURIComponent(post.id) + '">Edit post</a>' +
                '<button type="button" class="btn btn--danger btn--sm js-delete-post" data-id="' + esc(post.id) + '">Delete post</button>'
              : '') +
          '</div>' +
        '</article>' +

        '<section class="card" aria-labelledby="comments-title" style="margin-top:22px">' +
          '<h2 id="comments-title">Comments <span class="muted small">(' + comments.length + ')</span></h2>' +
          '<ul class="comment-list" id="comment-list">' +
            (comments.length
              ? comments.map(commentItem).join('')
              : '<li class="muted small">No comments yet. Be the first to add one below.</li>') +
          '</ul>' +
          '<form class="form js-comment-form" novalidate>' +
            '<div class="field" id="comment-field">' +
              '<label for="comment-text">Add a comment</label>' +
              '<textarea id="comment-text" name="comment" rows="3" ' +
                'placeholder="Share a thought, a question or a study tip\u2026" aria-describedby="comment-hint comment-error"></textarea>' +
              '<p class="field-error" id="comment-error" hidden></p>' +
              '<p class="hint" id="comment-hint">Comments are labelled with your demo profile name (' + esc(state.profile.displayName) + ').</p>' +
            '</div>' +
            '<div class="btn-group">' +
              '<button type="submit" class="btn">Post comment</button>' +
              '<a class="btn btn--ghost" href="#/bookmarks">Go to bookmarks</a>' +
            '</div>' +
            '<p class="alert alert--success" id="comment-status" role="status" hidden></p>' +
          '</form>' +
        '</section>' +

        (related.length
          ? '<section class="card" aria-labelledby="related-title" style="margin-top:22px">' +
              '<h2 id="related-title">More in ' + esc(post.category) + '</h2>' +
              '<ul class="mini-list">' +
                related.map(function (item) {
                  return '<li><span><a href="#/post?id=' + encodeURIComponent(item.id) + '">' + esc(item.title) +
                    '</a><span class="muted small"> by ' + esc(item.author) + '</span></span></li>';
                }).join('') +
              '</ul>' +
            '</section>'
          : '');
    }

    render();

    /* On this page a like or bookmark only changes its own control, so the
       comment form keeps whatever the visitor has typed. If the post itself
       disappears (reset or delete), fall back to a full re-render. */
    onChange(function () {
      if (!findPost(id)) render();
    });

    root.addEventListener('submit', function (event) {
      const form = event.target.closest('.js-comment-form');
      if (!form) return;
      event.preventDefault();

      const textarea = form.querySelector('#comment-text');
      const field = form.querySelector('#comment-field');
      const errorNode = form.querySelector('#comment-error');
      const status = form.querySelector('#comment-status');
      const value = textarea.value.trim();

      if (!value) {
        field.classList.add('has-error');
        textarea.setAttribute('aria-invalid', 'true');
        errorNode.textContent = 'Please write something before posting. A comment cannot be empty.';
        errorNode.hidden = false;
        textarea.focus();
        return;
      }

      field.classList.remove('has-error');
      textarea.removeAttribute('aria-invalid');
      errorNode.hidden = true;

      const comments = commentsFor(id);
      comments.push({
        author: state.profile.displayName,
        mine: true,
        date: todayISO(),
        text: value
      });
      saveState('comment');

      form.closest('.card').querySelector('#comment-list').innerHTML = comments.map(commentItem).join('');
      const heading = document.querySelector('#comments-title span');
      if (heading) heading.textContent = '(' + comments.length + ')';
      const meta = document.getElementById('post-comment-count');
      if (meta) meta.textContent = comments.length + (comments.length === 1 ? ' comment' : ' comments');

      textarea.value = '';
      status.textContent = 'Thanks! Your comment is now shown above.';
      status.hidden = false;
      announce('Comment added.');
    });
  };

  /* ---------- Page 5: Create / edit post ---------- */
  pages.createPost = function () {
    const form = document.getElementById('post-form');
    if (!form) return;

    const editId = getParam('edit');
    const editing = editId ? findPost(editId) : null;
    const canEdit = !!(editing && editing.isMine);

    const titleInput = form.querySelector('#post-title');
    const categorySelect = form.querySelector('#post-category');
    const contentInput = form.querySelector('#post-content');
    const status = document.getElementById('form-status');
    const heading = document.getElementById('form-heading');
    const submitBtn = document.getElementById('submit-button');
    const intro = document.getElementById('form-intro');
    const cancelLink = document.getElementById('cancel-link');

    categorySelect.innerHTML = '<option value="">Choose a study topic\u2026</option>' +
      TOPICS.map(function (topic) {
        return '<option value="' + esc(topic.name) + '">' + esc(topic.name) + '</option>';
      }).join('');

    if (editId && !canEdit) {
      status.className = 'alert alert--warning';
      status.textContent = 'Only posts you created in this demo session can be edited, so the create form is shown instead.';
      status.hidden = false;
    }

    if (canEdit) {
      heading.textContent = 'Edit your post';
      intro.textContent = 'Update the title, topic or content and save the changes. The post keeps its place in every list.';
      submitBtn.textContent = 'Save changes';
      cancelLink.href = '#/post?id=' + encodeURIComponent(editing.id);
      titleInput.value = editing.title;
      categorySelect.value = editing.category;
      contentInput.value = editing.content;
      document.title = 'Edit post - Klyvora';
    } else {
      cancelLink.href = '#/dashboard';
    }

    function setError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const errorNode = field.querySelector('.field-error');
      const control = field.querySelector('input, select, textarea');
      if (message) {
        field.classList.add('has-error');
        errorNode.textContent = message;
        errorNode.hidden = false;
        if (control) control.setAttribute('aria-invalid', 'true');
      } else {
        field.classList.remove('has-error');
        errorNode.hidden = true;
        if (control) control.removeAttribute('aria-invalid');
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let firstInvalid = null;
      let valid = true;

      const title = titleInput.value.trim();
      const category = categorySelect.value;
      const content = contentInput.value.trim();

      if (!title) {
        setError('field-title', 'Please give your post a title.');
        valid = false;
        firstInvalid = firstInvalid || titleInput;
      } else if (title.length < 5) {
        setError('field-title', 'Titles need at least 5 characters so readers know what to expect.');
        valid = false;
        firstInvalid = firstInvalid || titleInput;
      } else {
        setError('field-title', '');
      }

      if (!category) {
        setError('field-category', 'Please choose a study topic for your post.');
        valid = false;
        firstInvalid = firstInvalid || categorySelect;
      } else {
        setError('field-category', '');
      }

      if (!content) {
        setError('field-content', 'Please write the post content.');
        valid = false;
        firstInvalid = firstInvalid || contentInput;
      } else if (content.length < 40) {
        setError('field-content', 'Please write at least 40 characters so the post is useful to other students.');
        valid = false;
        firstInvalid = firstInvalid || contentInput;
      } else {
        setError('field-content', '');
      }

      if (!valid) {
        status.className = 'alert alert--error';
        status.textContent = 'Your post was not published yet. Please fix the highlighted fields.';
        status.hidden = false;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (canEdit) {
        editing.title = title;
        editing.category = category;
        editing.content = content;
        editing.date = todayISO();
        saveState('edit');
        status.className = 'alert alert--success';
        status.innerHTML = 'Your changes were saved. <a href="#/post?id=' + encodeURIComponent(editing.id) +
          '">Open the updated post</a>.';
        status.hidden = false;
        announce('Post updated.');
        return;
      }

      const id = 'user-' + state.nextId;
      state.nextId += 1;
      state.posts.push({
        id: id,
        title: title,
        category: category,
        author: state.profile.displayName,
        date: todayISO(),
        likes: 0,
        content: content,
        isMine: true
      });
      saveState('create');

      form.reset();
      status.className = 'alert alert--success';
      status.innerHTML = 'Published! Your post now appears across Klyvora in this session. ' +
        '<a href="#/post?id=' + encodeURIComponent(id) + '">Open your post</a> or ' +
        '<a href="#/dashboard">see it on the dashboard</a>.';
      status.hidden = false;
      announce('Post published.');
    });
  };

  /* ---------- Page 6: Profile ---------- */
  pages.profile = function () {
    const form = document.getElementById('profile-form');
    const postsHolder = document.getElementById('profile-posts');

    function renderHeader() {
      const nameNode = document.getElementById('profile-name');
      const userNode = document.getElementById('profile-username');
      const bioNode = document.getElementById('profile-bio');
      const avatarNode = document.getElementById('profile-avatar');
      if (nameNode) nameNode.textContent = state.profile.displayName;
      if (userNode) userNode.textContent = '@' + state.profile.username;
      if (bioNode) bioNode.textContent = state.profile.bio || 'No biography yet.';
      if (avatarNode) avatarNode.textContent = initials(state.profile.displayName);
    }

    function renderPosts() {
      const own = state.posts.filter(function (post) { return post.isMine; })
        .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      if (!own.length) {
        postsHolder.innerHTML = emptyState({
          title: 'No posts from this profile yet',
          message: 'Posts created in this demo session appear here. Nothing is permanently saved, so refreshing the page starts a fresh session.',
          actionHref: '#/create-post',
          actionLabel: 'Create your first post'
        });
        return;
      }
      postsHolder.innerHTML = '<div class="grid grid--auto">' + own.map(postCard).join('') + '</div>';
    }

    let nameInput = null;
    let userInput = null;
    let bioInput = null;
    let status = null;

    if (form) {
      nameInput = form.querySelector('#profile-name-input');
      userInput = form.querySelector('#profile-username-input');
      bioInput = form.querySelector('#profile-bio-input');
      status = document.getElementById('profile-status');

      nameInput.value = state.profile.displayName;
      userInput.value = state.profile.username;
      bioInput.value = state.profile.bio;

      var setProfileError = function (fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorNode = field.querySelector('.field-error');
        const control = field.querySelector('input, textarea');
        if (message) {
          field.classList.add('has-error');
          errorNode.textContent = message;
          errorNode.hidden = false;
          if (control) control.setAttribute('aria-invalid', 'true');
        } else {
          field.classList.remove('has-error');
          errorNode.hidden = true;
          if (control) control.removeAttribute('aria-invalid');
        }
      };

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        const username = userInput.value.trim().replace(/^@/, '');
        const bio = bioInput.value.trim();
        let valid = true;

        if (name.length < 2) {
          setProfileError('field-profile-name', 'Please enter a display name of at least 2 characters.');
          valid = false;
        } else {
          setProfileError('field-profile-name', '');
        }

        if (!username || !/^[a-z0-9._-]{3,20}$/i.test(username)) {
          setProfileError('field-profile-username', 'Usernames use 3-20 letters, numbers, dots, dashes or underscores.');
          valid = false;
        } else {
          setProfileError('field-profile-username', '');
        }

        if (bio.length > 240) {
          setProfileError('field-profile-bio', 'Please keep the biography under 240 characters.');
          valid = false;
        } else {
          setProfileError('field-profile-bio', '');
        }

        if (!valid) {
          status.className = 'alert alert--error';
          status.textContent = 'Your profile was not updated. Please check the highlighted fields.';
          status.hidden = false;
          return;
        }

        state.profile.displayName = name;
        state.profile.username = username;
        state.profile.bio = bio;
        saveState('profile');
        status.className = 'alert alert--success';
        status.textContent = 'Profile updated for this demo session. Comments you write now use the new display name.';
        status.hidden = false;
        announce('Profile updated.');
      });
    }

    renderHeader();
    renderPosts();

    onChange(function (reason) {
      if (!shouldRerender(reason, ['profile'])) return;
      renderHeader();
      renderPosts();
      if (form) {
        nameInput.value = state.profile.displayName;
        userInput.value = state.profile.username;
        bioInput.value = state.profile.bio;
      }
    });
  };

  /* ---------- Page 7: Bookmarks ---------- */
  pages.bookmarks = function () {
    const holder = document.getElementById('bookmark-list');
    const countNode = document.getElementById('bookmark-summary');
    if (!holder) return;

    function render() {
      const posts = state.bookmarkedIds
        .map(findPost)
        .filter(Boolean)
        .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

      if (countNode) {
        countNode.textContent = posts.length === 0
          ? 'You have no saved posts right now.'
          : 'You have ' + posts.length + (posts.length === 1 ? ' saved post' : ' saved posts') + ' in this demo session.';
      }

      if (!posts.length) {
        holder.innerHTML = emptyState({
          title: 'No bookmarks yet',
          message: 'Bookmarks you add during this session appear here. Use the Save button on any post card or post page to keep it for later.',
          actionHref: '#/topics',
          actionLabel: 'Discover study material'
        });
        return;
      }

      holder.innerHTML = '<div class="grid grid--auto">' + posts.map(function (post) {
        return '' +
          '<article class="post-card" data-post-id="' + esc(post.id) + '">' +
            '<div class="meta"><span class="badge">' + esc(post.category) + '</span>' +
              '<span>' + formatDate(post.date) + '</span></div>' +
            '<h3 class="post-card__title"><a href="#/post?id=' + encodeURIComponent(post.id) + '">' + esc(post.title) + '</a></h3>' +
            '<p class="post-card__excerpt">' + esc(excerpt(post.content)) + '</p>' +
            '<div class="post-card__footer">' +
              '<span>' + esc(post.author) + '</span>' +
              '<div class="post-card__actions">' + likeButton(post) + '</div>' +
            '</div>' +
            '<div class="btn-group">' +
              '<a class="btn btn--secondary btn--sm" href="#/post?id=' + encodeURIComponent(post.id) + '">Read post</a>' +
              '<button type="button" class="btn btn--ghost btn--sm js-remove-bookmark" data-id="' + esc(post.id) + '">Remove bookmark</button>' +
            '</div>' +
          '</article>';
      }).join('') + '</div>';
    }

    render();
    onChange(function (reason) {
      if (shouldRerender(reason, ['bookmark'])) render();
    });
  };

  /* ---------- Page 8: About ---------- */
  pages.about = function () {
    const countNode = document.getElementById('about-counts');
    if (!countNode) return;
    const render = function () {
      countNode.textContent = 'This demo currently holds ' + state.posts.length + ' posts across ' + TOPICS.length +
        ' study topics, with ' + totalComments() + ' comments written by visitors and sample authors combined.';
    };
    render();
    onChange(function (reason) {
      if (shouldRerender(reason)) render();
    });
  };

  /* ---------------------------------------------------------
     9. Boot
     --------------------------------------------------------- */

  /* Mounts the requested view. Each view is a <template> in this document, so
     cloning one gives its page module a clean set of elements and drops the
     change listeners that belonged to the previous view - the same result as
     a real page navigation, without leaving the file. */
  function renderRoute() {
    const route = currentRoute();
    const view = document.getElementById('view');
    const template = document.getElementById('tpl-' + route.name);
    if (!view || !template) return;

    /* Listeners registered by the outgoing view must not outlive it. */
    changeListeners.length = 0;

    view.innerHTML = '';
    view.appendChild(template.content.cloneNode(true));

    document.body.setAttribute('data-page', route.name);
    document.title = PAGE_TITLES[route.name] || PAGE_TITLES.home;
    markCurrentNav();

    const moduleName = PAGE_MODULES[route.name];
    if (moduleName && typeof pages[moduleName] === 'function') pages[moduleName]();

    updateSummaryCounts();
    syncToggleButtons(view);

    /* Deep link straight to a heading inside a view, e.g. #/about?section=testing. */
    const section = getParam('section');
    const heading = section ? document.getElementById(section) : null;
    if (heading && view.contains(heading)) {
      try { heading.scrollIntoView({ block: 'start' }); } catch (error) { /* optional */ }
      return;
    }

    if (typeof window.scrollTo === 'function') {
      try { window.scrollTo(0, 0); } catch (error) { /* optional */ }
    }
  }

  /* Hashes that are not view routes (the skip link's #main, for example) are
     left to the browser so ordinary in-page anchors keep working. */
  function routeFromHash() {
    const raw = String(window.location.hash || '');
    if (raw === '' || raw === '#') return 'home';
    if (raw.indexOf('#/') !== 0) return '';
    return currentRoute().name;
  }

  function boot() {
    initNavigation();
    initGlobalActions();
    initResetControls();
    initRouteLinks();
    renderRoute();
  }

  window.addEventListener('hashchange', function () {
    if (routeFromHash()) renderRoute();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Exposed only so the automated smoke test can inspect the demo state. */
  window.KlyvoraDemo = {
    state: state,
    topics: TOPICS,
    reset: resetDemo
  };
})();
