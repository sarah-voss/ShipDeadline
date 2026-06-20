
export function setActiveNav(navItems, activePage) {
    navItems.forEach(item => {
        item.classList.toggle(
            'active-state', 
            item.dataset.navItem === activePage
        );
    });
}