
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Modal.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\components\\Modal.svelte";

    // (12:0) {#if modal_show}
    function create_if_block$2(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "modal-content svelte-11s2moi");
    			add_location(div0, file$5, 14, 8, 385);
    			attr_dev(div1, "class", "modal svelte-11s2moi");
    			add_location(div1, file$5, 13, 4, 327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", self(/*toggle_modal*/ ctx[1]), false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:0) {#if modal_show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*modal_show*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*modal_show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*modal_show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { modal_show = false } = $$props;
    	const dispatcher = createEventDispatcher();

    	const toggle_modal = () => {
    		dispatcher("toogle_modal");
    	};

    	const writable_props = ['modal_show'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('modal_show' in $$props) $$invalidate(0, modal_show = $$props.modal_show);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		modal_show,
    		dispatcher,
    		toggle_modal
    	});

    	$$self.$inject_state = $$props => {
    		if ('modal_show' in $$props) $$invalidate(0, modal_show = $$props.modal_show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [modal_show, toggle_modal, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { modal_show: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get modal_show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modal_show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Un objet représentant une categorie.
     * @typedef {Object} category
     * @property {number} id - identifiant de la catégorie
     * @property {string} name - nom complet de la catégorie
     * @property {string} short_name - nom court de la catégorie
     * @property {string} type - type de la catégorie
     * @property {int} priority - ordre de priority de la catégorie
     * @property {int} parent_id - id de la catégorie parent
    */

    /**
     * @typedef {Object} article
     * @property {string} ref
     * @property {string} label
     * @property {Float32Array} prix
     * @property {int} category_id
     * @property {int} [priority]
     * @property {int} [base_category_id]
     */


    /**
     * renvoies les catégories de bases.
     * @param {category[]} categories 
     * @returns {category[]}
     */
    function get_base_categories(categories){
        return categories.filter(row => row.parent_id == 0);
    }

    /**
     * Renvoie l'arborescence de la category sous la forme d'une liste d'id.
     * @param {category[]} categories 
     * @param {int} category_id 
     * @returns 
     */
    function get_path_category(categories, category_id){
        let current_categorie = get_category_from_id(categories, category_id);
        let path = [];
        while (current_categorie.id != 0) {
            path.unshift(current_categorie.id);
            current_categorie = get_category_from_id(categories, current_categorie.parent_id);
        }
        return path;
    }

    /**
     * Renvoie la catégorie identifé par son id, si aucune categories 
     * n'esite pour cette id alors renvoie une erreur
     * @param {category[]} categories 
     * @param {int} category_id 
     * @returns 
     */
    function get_category_from_id(categories, category_id){
        let categorie = categories.filter(row => row.id == category_id);
        if (categorie) return categorie[0];
        else throw new Error(`la catégorie : '${category_id}' n'existe pas.`);
    }

    /**
     * Renvoie la liste des sous catégorie de la catégorie passé en paramètre
     * @param {category[]} categories
     * @param {int} category_id 
     * @returns {categorie[]}
     */
    function get_sub_categories(categories, category_id){
        return categories.filter(category => category.parent_id == category_id);
    }

    /**
     * Renvoie la liste des sous catégorie de la catégorie passé en paramètre
     * @param {article[]} articles 
     * @param {int} category_id 
     * @returns {categorie[]}
     */
    function get_articles_by_categ(articles, category_id){
        return articles.filter(article => article.category_id == category_id);
    }


    /**
     * Renvoie l'article identifié par sa référence.
     * Cette fonction initialise également les champs priority et base_category_id
     * @param {article[]} articles 
     * @param {category[]} categories
     * @param {string} ref 
     * @returns {article}
     */
    function get_article_by_ref(articles, categories, ref){
         // on commence par trouvé l'index de l'article en question.
         const article_index = articles.findIndex(row => row.ref === ref);
         if (article_index == -1) throw new Error(`L'article ${ref} n'existe pas !`);
         const article = articles[article_index];

         const base_category_id = get_path_category(categories, article.category_id)[0];
         const priority = article_index * 10;
        
         return {...article, priority, base_category_id};

    }

    /* src\devis\Article.svelte generated by Svelte v3.59.2 */

    const file$4 = "src\\devis\\Article.svelte";

    function create_fragment$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*article*/ ctx[0].ref + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*article*/ ctx[0].label + "";
    	let t2;
    	let t3;
    	let td2;
    	let input;
    	let t4;
    	let td3;
    	let t5_value = /*article*/ ctx[0].prix + "";
    	let t5;
    	let t6;
    	let td4;
    	let button0;
    	let t8;
    	let button1;
    	let t10;
    	let button2;
    	let t12;
    	let button3;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			input = element("input");
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			button0 = element("button");
    			button0.textContent = "up";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "down";
    			t10 = space();
    			button2 = element("button");
    			button2.textContent = "edit";
    			t12 = space();
    			button3 = element("button");
    			button3.textContent = "remove";
    			add_location(td0, file$4, 4, 4, 56);
    			add_location(td1, file$4, 5, 4, 84);
    			attr_dev(input, "type", "number");
    			input.value = "1";
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", "99");
    			add_location(input, file$4, 6, 8, 118);
    			add_location(td2, file$4, 6, 4, 114);
    			add_location(td3, file$4, 7, 4, 177);
    			add_location(button0, file$4, 9, 8, 220);
    			add_location(button1, file$4, 10, 8, 249);
    			add_location(button2, file$4, 11, 8, 280);
    			add_location(button3, file$4, 12, 8, 311);
    			add_location(td4, file$4, 8, 4, 206);
    			add_location(tr, file$4, 3, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, input);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, button0);
    			append_dev(td4, t8);
    			append_dev(td4, button1);
    			append_dev(td4, t10);
    			append_dev(td4, button2);
    			append_dev(td4, t12);
    			append_dev(td4, button3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*article*/ 1 && t0_value !== (t0_value = /*article*/ ctx[0].ref + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*article*/ 1 && t2_value !== (t2_value = /*article*/ ctx[0].label + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*article*/ 1 && t5_value !== (t5_value = /*article*/ ctx[0].prix + "")) set_data_dev(t5, t5_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Article', slots, []);
    	let { article } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (article === undefined && !('article' in $$props || $$self.$$.bound[$$self.$$.props['article']])) {
    			console.warn("<Article> was created without expected prop 'article'");
    		}
    	});

    	const writable_props = ['article'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    	};

    	$$self.$capture_state = () => ({ article });

    	$$self.$inject_state = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [article];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { article: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get article() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\devis\Category.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\devis\\Category.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (20:0) {#each article_list as article (article.ref)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let article;
    	let current;

    	article = new Article({
    			props: { article: /*article*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(article.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(article, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const article_changes = {};
    			if (dirty & /*article_list*/ 2) article_changes.article = /*article*/ ctx[4];
    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(article, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(20:0) {#each article_list as article (article.ref)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let tr;
    	let th;
    	let t0_value = /*category*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let td0;
    	let t2;
    	let td1;
    	let t3;
    	let td2;
    	let button;
    	let t5;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*article_list*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*article*/ ctx[4].ref;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			td0 = element("td");
    			t2 = space();
    			td1 = element("td");
    			t3 = space();
    			td2 = element("td");
    			button = element("button");
    			button.textContent = "Ajouter";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(th, "colspan", "2");
    			add_location(th, file$3, 14, 4, 340);
    			add_location(td0, file$3, 15, 4, 382);
    			add_location(td1, file$3, 16, 4, 397);
    			add_location(button, file$3, 17, 8, 416);
    			add_location(td2, file$3, 17, 4, 412);
    			add_location(tr, file$3, 13, 0, 330);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th);
    			append_dev(th, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td0);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, button);
    			insert_dev(target, t5, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*add_article*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*category*/ 1) && t0_value !== (t0_value = /*category*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*article_list*/ 2) {
    				each_value = /*article_list*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$3, each_1_anchor, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (detaching) detach_dev(t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Category', slots, []);
    	let { category } = $$props;
    	let { article_list } = $$props;
    	const dispatcher = createEventDispatcher();

    	const add_article = () => {
    		dispatcher("start_modal", { action: "add", category });
    	};

    	$$self.$$.on_mount.push(function () {
    		if (category === undefined && !('category' in $$props || $$self.$$.bound[$$self.$$.props['category']])) {
    			console.warn("<Category> was created without expected prop 'category'");
    		}

    		if (article_list === undefined && !('article_list' in $$props || $$self.$$.bound[$$self.$$.props['article_list']])) {
    			console.warn("<Category> was created without expected prop 'article_list'");
    		}
    	});

    	const writable_props = ['category', 'article_list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Category> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('category' in $$props) $$invalidate(0, category = $$props.category);
    		if ('article_list' in $$props) $$invalidate(1, article_list = $$props.article_list);
    	};

    	$$self.$capture_state = () => ({
    		Article,
    		createEventDispatcher,
    		category,
    		article_list,
    		dispatcher,
    		add_article
    	});

    	$$self.$inject_state = $$props => {
    		if ('category' in $$props) $$invalidate(0, category = $$props.category);
    		if ('article_list' in $$props) $$invalidate(1, article_list = $$props.article_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [category, article_list, add_article];
    }

    class Category extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { category: 0, article_list: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Category",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get category() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get article_list() {
    		throw new Error("<Category>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article_list(value) {
    		throw new Error("<Category>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\devis\EditableDevis.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\devis\\EditableDevis.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (21:8) {#each get_base_categories(categories) as category (category.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let category;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[2](/*category*/ ctx[4], ...args);
    	}

    	category = new Category({
    			props: {
    				category: /*category*/ ctx[4],
    				article_list: /*article_list*/ ctx[0].filter(func)
    			},
    			$$inline: true
    		});

    	category.$on("start_modal", /*start_modal_handler*/ ctx[3]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(category.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(category, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const category_changes = {};
    			if (dirty & /*categories*/ 2) category_changes.category = /*category*/ ctx[4];
    			if (dirty & /*article_list, categories*/ 3) category_changes.article_list = /*article_list*/ ctx[0].filter(func);
    			category.$set(category_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(category.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(category.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(category, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(21:8) {#each get_base_categories(categories) as category (category.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = get_base_categories(/*categories*/ ctx[1]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*category*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Référence";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Désignation";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Quantité";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Prix Tarif";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Édition";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$2, 12, 12, 250);
    			add_location(th1, file$2, 13, 12, 282);
    			add_location(th2, file$2, 14, 12, 316);
    			add_location(th3, file$2, 15, 12, 347);
    			add_location(th4, file$2, 16, 12, 380);
    			add_location(tr, file$2, 11, 8, 232);
    			add_location(thead, file$2, 10, 4, 215);
    			add_location(tbody, file$2, 19, 4, 431);
    			attr_dev(table, "class", "style-table");
    			add_location(table, file$2, 9, 0, 182);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(table, t9);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*get_base_categories, categories, article_list*/ 3) {
    				each_value = get_base_categories(/*categories*/ ctx[1]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tbody, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditableDevis', slots, []);
    	let { article_list } = $$props;
    	let { categories } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (article_list === undefined && !('article_list' in $$props || $$self.$$.bound[$$self.$$.props['article_list']])) {
    			console.warn("<EditableDevis> was created without expected prop 'article_list'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<EditableDevis> was created without expected prop 'categories'");
    		}
    	});

    	const writable_props = ['article_list', 'categories'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditableDevis> was created with unknown prop '${key}'`);
    	});

    	const func = (category, row) => row.base_category_id === category.id;

    	function start_modal_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('article_list' in $$props) $$invalidate(0, article_list = $$props.article_list);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    	};

    	$$self.$capture_state = () => ({
    		get_base_categories,
    		Category,
    		article_list,
    		categories
    	});

    	$$self.$inject_state = $$props => {
    		if ('article_list' in $$props) $$invalidate(0, article_list = $$props.article_list);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [article_list, categories, func, start_modal_handler];
    }

    class EditableDevis extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { article_list: 0, categories: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditableDevis",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get article_list() {
    		throw new Error("<EditableDevis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article_list(value) {
    		throw new Error("<EditableDevis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<EditableDevis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<EditableDevis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\devis\CategoryForm.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\devis\\CategoryForm.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:4) {#each categories as category (category.id)}
    function create_each_block$1(key_1, ctx) {
    	let button;
    	let t_value = /*category*/ ctx[4].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*category*/ ctx[4]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1vrd102");
    			add_location(button, file$1, 13, 8, 329);
    			this.first = button;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*categories*/ 1 && t_value !== (t_value = /*category*/ ctx[4].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(13:4) {#each categories as category (category.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*categories*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*category*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-1vrd102");
    			add_location(div, file$1, 11, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*click_on_categ, categories*/ 3) {
    				each_value = /*categories*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$1, null, get_each_context$1);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CategoryForm', slots, []);
    	let { categories } = $$props;
    	const dispatcher = createEventDispatcher();

    	const click_on_categ = category_id => {
    		dispatcher("click_on_categ", { category_id });
    	};

    	$$self.$$.on_mount.push(function () {
    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<CategoryForm> was created without expected prop 'categories'");
    		}
    	});

    	const writable_props = ['categories'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CategoryForm> was created with unknown prop '${key}'`);
    	});

    	const click_handler = category => {
    		click_on_categ(category.id);
    	};

    	$$self.$$set = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		categories,
    		dispatcher,
    		click_on_categ
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [categories, click_on_categ, click_handler];
    }

    class CategoryForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { categories: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CategoryForm",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get categories() {
    		throw new Error("<CategoryForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<CategoryForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\devis\ArticleForm.svelte generated by Svelte v3.59.2 */

    const file = "src\\devis\\ArticleForm.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (14:12) {#each articles as article}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*article*/ ctx[1].ref + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*article*/ ctx[1].label + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*article*/ ctx[1].prix + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			add_location(td0, file, 15, 20, 395);
    			add_location(td1, file, 16, 20, 439);
    			add_location(td2, file, 17, 20, 485);
    			attr_dev(tr, "class", "svelte-1h7e1av");
    			add_location(tr, file, 14, 16, 369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*articles*/ 1 && t0_value !== (t0_value = /*article*/ ctx[1].ref + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*articles*/ 1 && t2_value !== (t2_value = /*article*/ ctx[1].label + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*articles*/ 1 && t4_value !== (t4_value = /*article*/ ctx[1].prix + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:12) {#each articles as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let each_value = /*articles*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Référence";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Désignation";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Prix Tarif";
    			t5 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "svelte-1h7e1av");
    			add_location(th0, file, 7, 16, 163);
    			attr_dev(th1, "class", "svelte-1h7e1av");
    			add_location(th1, file, 8, 16, 199);
    			attr_dev(th2, "class", "svelte-1h7e1av");
    			add_location(th2, file, 9, 16, 237);
    			attr_dev(tr, "class", "svelte-1h7e1av");
    			add_location(tr, file, 6, 12, 141);
    			attr_dev(thead, "class", "svelte-1h7e1av");
    			add_location(thead, file, 5, 8, 120);
    			add_location(tbody, file, 12, 8, 303);
    			attr_dev(table, "class", "style-table svelte-1h7e1av");
    			add_location(table, file, 4, 4, 83);
    			attr_dev(div, "class", "scroll-container svelte-1h7e1av");
    			add_location(div, file, 3, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(table, t5);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tbody, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*articles*/ 1) {
    				each_value = /*articles*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArticleForm', slots, []);
    	let { articles } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (articles === undefined && !('articles' in $$props || $$self.$$.bound[$$self.$$.props['articles']])) {
    			console.warn("<ArticleForm> was created without expected prop 'articles'");
    		}
    	});

    	const writable_props = ['articles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArticleForm> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('articles' in $$props) $$invalidate(0, articles = $$props.articles);
    	};

    	$$self.$capture_state = () => ({ articles });

    	$$self.$inject_state = $$props => {
    		if ('articles' in $$props) $$invalidate(0, articles = $$props.articles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [articles];
    }

    class ArticleForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { articles: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArticleForm",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get articles() {
    		throw new Error("<ArticleForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set articles(value) {
    		throw new Error("<ArticleForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\devis\ModalContent.svelte generated by Svelte v3.59.2 */

    // (32:0) {:else}
    function create_else_block(ctx) {
    	let articleform;
    	let current;

    	articleform = new ArticleForm({
    			props: { articles: /*articles*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(articleform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(articleform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const articleform_changes = {};
    			if (dirty & /*articles*/ 2) articleform_changes.articles = /*articles*/ ctx[1];
    			articleform.$set(articleform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articleform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articleform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articleform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(32:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:0) {#if sub_categories.length !== 0}
    function create_if_block$1(ctx) {
    	let categoryform;
    	let current;

    	categoryform = new CategoryForm({
    			props: { categories: /*sub_categories*/ ctx[0] },
    			$$inline: true
    		});

    	categoryform.$on("click_on_categ", /*click_on_categ*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(categoryform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(categoryform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const categoryform_changes = {};
    			if (dirty & /*sub_categories*/ 1) categoryform_changes.categories = /*sub_categories*/ ctx[0];
    			categoryform.$set(categoryform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(categoryform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(categoryform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(categoryform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(30:0) {#if sub_categories.length !== 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sub_categories*/ ctx[0].length !== 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalContent', slots, []);
    	let { modal_info } = $$props;
    	let { categories } = $$props;
    	let { all_articles } = $$props;
    	let sub_categories;
    	let articles;
    	const dispatcher = createEventDispatcher();

    	function click_on_categ(e) {
    		const category = get_category_from_id(categories, e.detail.category_id);
    		dispatcher("start_modal", { ...modal_info, category });
    	}

    	$$self.$$.on_mount.push(function () {
    		if (modal_info === undefined && !('modal_info' in $$props || $$self.$$.bound[$$self.$$.props['modal_info']])) {
    			console.warn("<ModalContent> was created without expected prop 'modal_info'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<ModalContent> was created without expected prop 'categories'");
    		}

    		if (all_articles === undefined && !('all_articles' in $$props || $$self.$$.bound[$$self.$$.props['all_articles']])) {
    			console.warn("<ModalContent> was created without expected prop 'all_articles'");
    		}
    	});

    	const writable_props = ['modal_info', 'categories', 'all_articles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('modal_info' in $$props) $$invalidate(3, modal_info = $$props.modal_info);
    		if ('categories' in $$props) $$invalidate(4, categories = $$props.categories);
    		if ('all_articles' in $$props) $$invalidate(5, all_articles = $$props.all_articles);
    	};

    	$$self.$capture_state = () => ({
    		get_sub_categories,
    		get_articles_by_categ,
    		get_category_from_id,
    		createEventDispatcher,
    		CategoryForm,
    		ArticleForm,
    		modal_info,
    		categories,
    		all_articles,
    		sub_categories,
    		articles,
    		dispatcher,
    		click_on_categ
    	});

    	$$self.$inject_state = $$props => {
    		if ('modal_info' in $$props) $$invalidate(3, modal_info = $$props.modal_info);
    		if ('categories' in $$props) $$invalidate(4, categories = $$props.categories);
    		if ('all_articles' in $$props) $$invalidate(5, all_articles = $$props.all_articles);
    		if ('sub_categories' in $$props) $$invalidate(0, sub_categories = $$props.sub_categories);
    		if ('articles' in $$props) $$invalidate(1, articles = $$props.articles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modal_info, categories, sub_categories, all_articles*/ 57) {
    			{
    				const category_id = modal_info.category.id;
    				$$invalidate(0, sub_categories = get_sub_categories(categories, category_id));

    				if (sub_categories.length === 0) {
    					$$invalidate(1, articles = get_articles_by_categ(all_articles, category_id));
    				}
    			}
    		}
    	};

    	return [sub_categories, articles, click_on_categ, modal_info, categories, all_articles];
    }

    class ModalContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			modal_info: 3,
    			categories: 4,
    			all_articles: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalContent",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get modal_info() {
    		throw new Error("<ModalContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modal_info(value) {
    		throw new Error("<ModalContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<ModalContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<ModalContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get all_articles() {
    		throw new Error("<ModalContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set all_articles(value) {
    		throw new Error("<ModalContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\devis\Devis.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1 } = globals;

    // (80:0) <Modal modal_show={modal_info.display} on:toogle_modal={toogle_modal}>
    function create_default_slot(ctx) {
    	let modalcontent;
    	let current;

    	modalcontent = new ModalContent({
    			props: {
    				modal_info: /*modal_info*/ ctx[3],
    				all_articles: /*all_articles*/ ctx[1],
    				categories: /*categories*/ ctx[0]
    			},
    			$$inline: true
    		});

    	modalcontent.$on("start_modal", /*start_modal*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(modalcontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalcontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalcontent_changes = {};
    			if (dirty & /*modal_info*/ 8) modalcontent_changes.modal_info = /*modal_info*/ ctx[3];
    			if (dirty & /*all_articles*/ 2) modalcontent_changes.all_articles = /*all_articles*/ ctx[1];
    			if (dirty & /*categories*/ 1) modalcontent_changes.categories = /*categories*/ ctx[0];
    			modalcontent.$set(modalcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(80:0) <Modal modal_show={modal_info.display} on:toogle_modal={toogle_modal}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let editabledevis;
    	let t;
    	let modal;
    	let current;

    	editabledevis = new EditableDevis({
    			props: {
    				article_list: /*article_list*/ ctx[2],
    				categories: /*categories*/ ctx[0]
    			},
    			$$inline: true
    		});

    	editabledevis.$on("start_modal", /*start_modal*/ ctx[5]);

    	modal = new Modal({
    			props: {
    				modal_show: /*modal_info*/ ctx[3].display,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("toogle_modal", /*toogle_modal*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(editabledevis.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(editabledevis, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const editabledevis_changes = {};
    			if (dirty & /*article_list*/ 4) editabledevis_changes.article_list = /*article_list*/ ctx[2];
    			if (dirty & /*categories*/ 1) editabledevis_changes.categories = /*categories*/ ctx[0];
    			editabledevis.$set(editabledevis_changes);
    			const modal_changes = {};
    			if (dirty & /*modal_info*/ 8) modal_changes.modal_show = /*modal_info*/ ctx[3].display;

    			if (dirty & /*$$scope, modal_info, all_articles, categories*/ 4107) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editabledevis.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editabledevis.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editabledevis, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Devis', slots, []);
    	let { default_articles } = $$props;
    	let { categories } = $$props;
    	let { all_articles } = $$props;
    	let { devis_data = [] } = $$props;
    	let article_list = [];
    	let action_list = [];
    	let modal_info = { display: false };

    	// initialisation des articles par défault
    	for (const article of default_articles) {
    		article_list.push(get_article_by_ref(all_articles, categories, article.ref));
    	}

    	// trie des articles par leurs priorité
    	article_list.sort((a, b) => a.priority - b.priority);

    	const toogle_modal = () => {
    		$$invalidate(3, modal_info = {
    			...modal_info,
    			display: !modal_info.display
    		});
    	};

    	/**
     * ajoute l'action passé en paramètre à la file d'actions (action_queue)
     * et execute l'action passé en paramètre
     * @param {object} action 
     */
    	function push_action(action) {
    		if (execute_action(action)) {
    			action_list.push(action);
    		}
    	}

    	/**
     * execute l'action passé en paramètre
     * @param {object} action 
     * @returns {boolean}
     */
    	function execute_action(action) {
    		try {
    			if (action.type == "add") {
    				add_article(action.ref);
    			} else if (action.type == "edit") {
    				edit_article(action.old_ref, action.new_ref);
    			} else if (action.type == "move") {
    				move_article(action.ref, action.direction);
    			} else if (action.type == "remove") {
    				remove_article(action.ref);
    			} else {
    				throw new Error();
    			}

    			return true;
    		} catch(e) {
    			return false;
    		}
    	}

    	/**
     * 
     * @param ref
     */
    	function add_article(ref) {
    		const new_article = get_article_by_ref(all_articles, categories, ref);
    		$$invalidate(2, article_list = [...article_list, new_article]);
    		article_list.sort((a, b) => a.priority - b.priority);
    	}

    	function start_modal(e) {
    		$$invalidate(3, modal_info = {
    			...modal_info,
    			display: true,
    			...e.detail
    		});
    	} //console.log(modal_info);

    	$$self.$$.on_mount.push(function () {
    		if (default_articles === undefined && !('default_articles' in $$props || $$self.$$.bound[$$self.$$.props['default_articles']])) {
    			console.warn("<Devis> was created without expected prop 'default_articles'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<Devis> was created without expected prop 'categories'");
    		}

    		if (all_articles === undefined && !('all_articles' in $$props || $$self.$$.bound[$$self.$$.props['all_articles']])) {
    			console.warn("<Devis> was created without expected prop 'all_articles'");
    		}
    	});

    	const writable_props = ['default_articles', 'categories', 'all_articles', 'devis_data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Devis> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('default_articles' in $$props) $$invalidate(6, default_articles = $$props.default_articles);
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('all_articles' in $$props) $$invalidate(1, all_articles = $$props.all_articles);
    		if ('devis_data' in $$props) $$invalidate(7, devis_data = $$props.devis_data);
    	};

    	$$self.$capture_state = () => ({
    		Modal,
    		EditableDevis,
    		ModalContent,
    		get_article_by_ref,
    		default_articles,
    		categories,
    		all_articles,
    		devis_data,
    		article_list,
    		action_list,
    		modal_info,
    		toogle_modal,
    		push_action,
    		execute_action,
    		add_article,
    		start_modal
    	});

    	$$self.$inject_state = $$props => {
    		if ('default_articles' in $$props) $$invalidate(6, default_articles = $$props.default_articles);
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('all_articles' in $$props) $$invalidate(1, all_articles = $$props.all_articles);
    		if ('devis_data' in $$props) $$invalidate(7, devis_data = $$props.devis_data);
    		if ('article_list' in $$props) $$invalidate(2, article_list = $$props.article_list);
    		if ('action_list' in $$props) action_list = $$props.action_list;
    		if ('modal_info' in $$props) $$invalidate(3, modal_info = $$props.modal_info);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		categories,
    		all_articles,
    		article_list,
    		modal_info,
    		toogle_modal,
    		start_modal,
    		default_articles,
    		devis_data
    	];
    }

    class Devis extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			default_articles: 6,
    			categories: 0,
    			all_articles: 1,
    			devis_data: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Devis",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get default_articles() {
    		throw new Error_1("<Devis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set default_articles(value) {
    		throw new Error_1("<Devis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error_1("<Devis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error_1("<Devis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get all_articles() {
    		throw new Error_1("<Devis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set all_articles(value) {
    		throw new Error_1("<Devis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get devis_data() {
    		throw new Error_1("<Devis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set devis_data(value) {
    		throw new Error_1("<Devis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    // (7:0) {#if (title == "Devis2")}
    function create_if_block(ctx) {
    	let devis;
    	let current;
    	const devis_spread_levels = [/*global_vars*/ ctx[1]];
    	let devis_props = {};

    	for (let i = 0; i < devis_spread_levels.length; i += 1) {
    		devis_props = assign(devis_props, devis_spread_levels[i]);
    	}

    	devis = new Devis({ props: devis_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(devis.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(devis, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const devis_changes = (dirty & /*global_vars*/ 2)
    			? get_spread_update(devis_spread_levels, [get_spread_object(/*global_vars*/ ctx[1])])
    			: {};

    			devis.$set(devis_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(devis.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(devis.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(devis, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(7:0) {#if (title == \\\"Devis2\\\")}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] == "Devis2" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0] == "Devis2") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*title*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { title } = $$props;
    	let { global_vars } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<App> was created without expected prop 'title'");
    		}

    		if (global_vars === undefined && !('global_vars' in $$props || $$self.$$.bound[$$self.$$.props['global_vars']])) {
    			console.warn("<App> was created without expected prop 'global_vars'");
    		}
    	});

    	const writable_props = ['title', 'global_vars'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('global_vars' in $$props) $$invalidate(1, global_vars = $$props.global_vars);
    	};

    	$$self.$capture_state = () => ({ Devis, title, global_vars });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('global_vars' in $$props) $$invalidate(1, global_vars = $$props.global_vars);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, global_vars];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 0, global_vars: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get title() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get global_vars() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set global_vars(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.getElementById('svelte-app'),
    	props: {
    	  title: document.title,
    	  global_vars: window.global_vars
    	},
      });

    return app;

})();
//# sourceMappingURL=bundle.js.map
