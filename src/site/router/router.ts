import { Component, Prop, Part } from '@mdi/element';
import { Router } from './../shared/router';
import SiteNavDocs from './../navDocs/navDocs';
import SiteNavMenu from './../navMenu/navMenu';
import { navigationItems } from './constants';

import '@mdi/components/mdi/annoy';
import '@mdi/components/mdi/database';
import '@mdi/components/mdi/icon';
import '@mdi/components/mdi/header';
import '@mdi/components/mdi/search';
import MdiDatabase from '@mdi/components/mdi/database';
import MdiSearch from '@mdi/components/mdi/search';

import template from "./router.html";
import style from './router.css';

@Component({
  selector: 'site-router',
  style,
  template
})
export default class SiteRouter extends HTMLElement {
  @Part() $container: HTMLDivElement;
  @Part() $search: MdiSearch;
  @Part() $database: MdiDatabase;
  @Part() $siteNavDocs: SiteNavDocs;
  @Part() $siteNavMenu: SiteNavMenu;
  @Part() $navDocs: HTMLAnchorElement;
  @Part() $navIcons: HTMLAnchorElement;

  router: any = null;
  page: any = null;
  docsOpen = false;
  menuOpen = false;

  fontId = 'D051337E-BC7E-11E5-A4E9-842B2B6CFE1B';

  connectedCallback() {
    this.$database.addEventListener('sync', async (e: any) => {
      const { db } = e.detail;
      this.sync(db);
    });
    this.$database.font = this.fontId;
    this.$search.addEventListener('focus', this.handleFocusSearch.bind(this));
    this.$search.items = navigationItems.filter(x => !x.hideInSearch);
    this.$siteNavDocs.items = navigationItems;
    this.$siteNavMenu.items = navigationItems;
    this.$navIcons.addEventListener('click', this.handleNavIcons.bind(this));
    this.$navDocs.addEventListener('click', this.handleNavDocs.bind(this));

    this.router = new Router({
      mode: 'history',
      page404: (path) => {
        console.log('"/' + path + '" Page not found');
      }
    });

    this.router.add('', () => {
      this.updatePage('home');
    });

    this.router.add('icons', () => {
      this.updatePage('icons');
    });

    this.router.add('icon/(:any)', (name) => {
      console.log('Icon, ' + name);
      this.updatePage('icon');
      this.page.name = name;
    });

    this.router.add('getting-started/(:any)', (slug) => {
      this.updatePage('view');
      this.page.slug = `getting-started/${slug}`;
    });

    this.router.addUriListener();

    this.router.check();
  }

  async sync(db) {
    const count = await db.getCount(this.fontId);
    console.log('Total Icons', count);
    const icons = await db.getIcons(this.fontId);
    console.log('Icon Objects:', icons.length);
    // Search
    this.$search.icons = icons;
    // All Pages
    this.page.icons = icons;
  }

  handleFocusSearch() {
    this.docsOpen = false;
    this.menuOpen = false;
    this.render();
  }

  handleNavIcons() {

  }

  handleNavDocs(e) {
    this.docsOpen = !this.docsOpen;
    this.render();
    e.preventDefault();
  }

  updatePage(page: string) {
    // Remove any current pages
    if (this.page) {
      this.page.remove();
    }
    // Add New Page
    console.log(`site-page-${page}`);
    this.page = document.createElement(`site-page-${page}`);
    this.page.navigationItems = navigationItems;
    this.$container.appendChild(this.page);
  }

  render(changes?: any) {
    this.$siteNavDocs.style.display = this.docsOpen ? '' : 'none';
    this.$navDocs.classList.toggle('active', this.docsOpen);
  }
}