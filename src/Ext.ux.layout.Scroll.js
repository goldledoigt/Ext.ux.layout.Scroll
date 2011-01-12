Ext.ns("Ext.ux.layout");

Ext.override(Ext.Element, {
	animatedScrollIntoView:function(container, hscroll, animate){
		var z = new Number(0),
		c = Ext.getDom(container) || Ext.getBody().dom,
		el = this.dom,
		o = this.getOffsetsTo(c),
		ct = c.scrollTop||z,
		cl = c.scrollLeft||z,
		l = o[0] + cl,
		t = o[1] + ct,
		b = t + el.offsetHeight,
		r = l + el.offsetWidth,
		ch = c.clientHeight,
		cb = ct + ch,
		cr = cl + c.clientWidth,
		to = [cl, ct];  // scrollLeft and scrollTop end animation values

        if (el.offsetHeight > ch || t < ct) {
            to[1] = t;
        } else if (b > cb){
            to[1] = b-ch;
        }

        if (hscroll !== false) {
            if(el.offsetWidth > c.clientWidth || l < cl){
                to[0] = l;
            }else if(r > cr){
                to[0] = r - c.clientWidth;
            }
        }

		// No scrolling needed. Just call any specified callback immediately and return.
        if (to[0] == cl && to[1] == ct) {
            Ext.isObject(animate) && animate.callback && animate.callback.call(animate.scope || window);
            return;
        }

        if (animate && Ext.lib.Anim) {
            var d, cb = null, e;
            if (Ext.isObject(animate)) {
                d = animate.duration;
                cb = animate.scope ? animate.callback.createDelegate(animate.scope) : animate.callback;
                e = animate.easing;
            }
            Ext.fly(container).animate({scroll: {"to": to}}, d, cb, e, 'scroll');
        } else {
            c.scrollLeft = to[0];
            c.scrollTop = to[1];
        }

        return this;
    }
});

/***** VERTICAL SCROLL
********************************************************************************/

Ext.ux.layout.VScroll = Ext.extend(Ext.layout.ContainerLayout, {

	type:"vscroll"

	,deferredRender:true

	// ,renderHidden:true

	,monitorResize:true

	,setActiveItem:function(item) {
		var ai = this.activeItem,
		ct = this.container;
		item = ct.getComponent(item),
		itemIndex = ct.items.indexOf(item);
		if (item && ai != item) {
			if (ai) {
				// ai.hide();
			}
			var layout = item.doLayout && (this.layoutOnCardChange || !item.rendered);
			this.activeItem = item;
			delete item.deferLayout;
			// item.show();
			this.layout();
			if (layout) {
				item.doLayout();
			}
		}
	}

	,onLayout:function(ct, target) {
		Ext.ux.layout.VScroll.superclass.onLayout.call(this, ct, target);
		if (!ct.collapsed) {
			var size = this.getLayoutSize();
			this.setItemSize(this.activeItem || ct.items.itemAt(0), size);
		}
	}

	,getLayoutSize:function() {
		var size = this.getLayoutTargetSize();
		size.width -= this.getScrollbarWidth();
		return size;
	}

	,renderAll:function(ct, target) {
		var child,
		l = ct.items.items.length,
		size = this.getLayoutSize();
		if (!this.innerCt) {
			this.innerCt = target.createChild();
			for (var i = 0; i < l; i++) {
				this.innerCt.createChild();
			}
		}
		for (var i = 0; i < l; i++) {
			child = Ext.fly(this.innerCt.dom.childNodes[i]);
			child.setSize(size);
		}
		if (this.deferredRender) {
			var innerTarget = this.getItemTarget(this.activeItem);
			innerTarget.animatedScrollIntoView(target, false, true);
			this.renderItem(this.activeItem, undefined, innerTarget);
		} else {
			Ext.ux.layout.VScroll.superclass.renderAll.call(this, ct, target);
		}
	}

	,getItemTarget:function(item) {
		var index = this.container.items.indexOf(item);
		return Ext.get(this.innerCt.dom.childNodes[index]);
	}

	,getLayoutTargetSize:function() {
		var target = this.container.getLayoutTarget();
		if (!target) {
			return {};
		}
		return target.getStyleSize();
	}

	,getScrollbarWidth:function() {
		var ct = this.container,
		l = ct.items.items.length;
		return (l > 1 && ct.autoScroll ? 15 : 0);
	}

	,setItemSize:function(item, size) {
		if (item && size.height > 0) {
			item.setSize(size);
		}
	}

	,selectNextItem:function() {
		var items = this.container.items,
		c = items.getCount(),
		index = items.indexOf(this.activeItem),
		pos = index > -1 && index < c - 1 ? index + 1 : c - 1;
		return this.setActiveItem(pos);
	}

	,selectPreviousItem:function() {
		var items = this.container.items,
		index = items.indexOf(this.activeItem),
		pos = index > 0 ? --index : 0;
		return this.setActiveItem(pos);
	}

});

Ext.Container.LAYOUTS['vscroll'] = Ext.ux.layout.VScroll;


/***** HORIZONTAL SCROLL
********************************************************************************/

Ext.ux.layout.HScroll = Ext.extend(Ext.ux.layout.VScroll, {

	type:"hscroll"

	,renderAll:function(ct, target) {
		var child, totalWidth = 0,
		l = ct.items.items.length,
		size = this.getLayoutSize();
		if (!this.innerCt) {
			this.innerCt = target.createChild();
			for (var i = 0; i < l; i++) {
				this.innerCt.createChild();
			}
		}
		for (var i = 0; i < l; i++) {
			child = Ext.fly(this.innerCt.dom.childNodes[i]);
			child.setSize(size);
			totalWidth += size.width;
			child.setStyle({"float":"left"});
		}
		this.innerCt.setWidth(totalWidth);
		if (this.deferredRender) {
			var innerTarget = this.getItemTarget(this.activeItem);
			innerTarget.animatedScrollIntoView(target, true, true);
			this.renderItem(this.activeItem, undefined, innerTarget);
		} else {
			Ext.ux.layout.HScroll.superclass.renderAll.call(this, ct, target);
		}
	}

	,getLayoutSize:function() {
		var size = this.getLayoutTargetSize();
		size.height -= this.getScrollbarWidth();
		return size;
	}

});

Ext.Container.LAYOUTS['hscroll'] = Ext.ux.layout.HScroll;
