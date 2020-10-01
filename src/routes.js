import React from 'react';
import $ from 'jquery';
import RequireAuth from './RequireAuth';
window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));

const UIBasicButton = React.lazy(() => import('./Demo/UIElements/Basic/Button'));
const UIBasicBadges = React.lazy(() => import('./Demo/UIElements/Basic/Badges'));
const UIBasicBreadcrumbPagination = React.lazy(() => import('./Demo/UIElements/Basic/BreadcrumbPagination'));

const UIBasicCollapse = React.lazy(() => import('./Demo/UIElements/Basic/Collapse'));
const UIBasicTabsPills = React.lazy(() => import('./Demo/UIElements/Basic/TabsPills'));
const UIBasicBasicTypography = React.lazy(() => import('./Demo/UIElements/Basic/Typography'));
const Search = React.lazy(() => import('./Demo/UIElements/Basic/search'));
const ProductDetail = React.lazy(() => import('./Demo/UIElements/Basic/productdetail'));
const Products = React.lazy(() => import('./Demo/UIElements/Basic/products'));

const Carts = React.lazy(() => import('./Demo/UIElements/Basic/cart'));
const CartDetail = React.lazy(() => import('./Demo/UIElements/Basic/cartdetail'));
const NewCart = React.lazy(() => import('./Demo/UIElements/Basic/NewCart'));

const Alerts = React.lazy(() => import('./Demo/UIElements/Basic/alert'));
const Reports = React.lazy(() => import('./Demo/UIElements/Basic/report'));
const Locations = React.lazy(() => import('./Demo/UIElements/Basic/location'));
const Charts = React.lazy(() => import('./Demo/UIElements/Basic/charts'));
// const FormsElements = React.lazy(() => import('./Demo/Forms/FormsElements'));

const BootstrapTable = React.lazy(() => import('./Demo/Tables/BootstrapTable'));

const Nvd3Chart = React.lazy(() => import('./Demo/Charts/Nvd3Chart/index'));

const GoogleMap = React.lazy(() => import('./Demo/Maps/GoogleMap/index'));

const OtherSamplePage = React.lazy(() => import('./Demo/Other/SamplePage'));
const OtherDocs = React.lazy(() => import('./Demo/Other/Docs'));



const routes = [
    { path: '/dashboard/default', exact: true, name: 'Default', component: RequireAuth(DashboardDefault) },
    { path: '/basic/button', exact: true, name: 'Basic Button', component: UIBasicButton },
    { path: '/basic/badges', exact: true, name: 'Basic Badges', component: UIBasicBadges },
    { path: '/basic/breadcrumb-paging', exact: true, name: 'Basic Breadcrumb Pagination', component: UIBasicBreadcrumbPagination },
    { path: '/basic/collapse', exact: true, name: 'Basic Collapse', component: UIBasicCollapse },
    { path: '/basic/tabs-pills', exact: true, name: 'Basic Tabs & Pills', component: UIBasicTabsPills },
    { path: '/basic/typography', exact: true, name: 'Basic Typography', component: UIBasicBasicTypography },
    { path: '/basic/search', exact: true, name: 'Search', component: RequireAuth(Search) },
    { path: '/basic/detail/:componentid', exact: true, name: 'ProductDetail', component: RequireAuth(ProductDetail) },
    { path: '/basic/products/:stockid/:componentid', exact: true, name: 'Products', component: RequireAuth(Products) },
    { path: '/basic/carts', exact: true, name: 'Cart', component: RequireAuth(Carts) },
    { path: '/basic/cartdetail/:id', exact: true, name: 'CartDetail', component: RequireAuth(CartDetail) },
    { path: '/basic/newcart', exact: true, name: 'NewCart', component: RequireAuth(NewCart) },

    { path: '/basic/alerts', exact: true, name: 'Alert', component: RequireAuth(Alerts) },
    { path: '/basic/reports', exact: true, name: 'Report', component: RequireAuth(Reports) },
    { path: '/basic/charts', exact: true, name: 'Chart', component: RequireAuth(Charts) },
    { path: '/basic/locations', exact: true, name: 'Location', component: RequireAuth(Locations) },

    { path: '/tables/bootstrap', exact: true, name: 'Bootstrap Table', component: BootstrapTable },
    { path: '/charts/nvd3', exact: true, name: 'Nvd3 Chart', component: Nvd3Chart },
    { path: '/maps/google-map', exact: true, name: 'Google Map', component: GoogleMap },
    { path: '/sample-page', exact: true, name: 'Sample Page', component: OtherSamplePage },
    { path: '/docs', exact: true, name: 'Documentation', component: OtherDocs },
];

export default routes;