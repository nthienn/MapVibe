import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { menuConfig } from "../../config/menuConfig";
import { canViewMenuItem } from "../../utils/auth";

const MobileMenu = ({ isOpen, onClose, menuItems = menuConfig }) => {
  const { user } = useAuth();
  const [activePanel, setActivePanel] = useState("main");

  useEffect(() => {
    if (isOpen) {
      setActivePanel("main");
    }
  }, [isOpen]);

  // Recursive Algorithm: Automatically transforms menu trees into flat panels.
  const generatePanels = (menuItems, user) => {
    const panels = [];
    const parentMap = {}; // Save the Child -> Parent relationship to handle the Back button and swipe effects.

    const filterItems = (items) =>
      items.filter((item) => canViewMenuItem(item, user));

    // 1. Initialize the original "main" panel.
    panels.push({
      id: "main",
      title: "Menu",
      parent: null,
      items: filterItems(menuItems),
    });

    // 2. The recursive function scans down to the sublevels.
    const traverse = (items, parentId) => {
      const filtered = filterItems(items);
      filtered.forEach((item) => {
        if (item.children && item.children.length > 0) {
          parentMap[item.id] = parentId;
          panels.push({
            id: item.id,
            title: item.title,
            parent: parentId,
            items: filterItems(item.children),
          });
          traverse(item.children, item.id); // Recursion down to a deeper level (e.g., level 3, level 4)
        }
      });
    };

    traverse(menuItems, "main");
    return { panels, parentMap };
  };

  const { panels, parentMap } = generatePanels(menuItems, user);

  // Algorithm to find a sequence of parent/grandparent classes to attach the backslide effect class.
  const getAncestors = (currentId) => {
    const list = [];
    let current = parentMap[currentId];
    while (current) {
      list.push(current);
      current = parentMap[current]; // Go back up to find your father's father.
    }
    return list;
  };

  const ancestors = getAncestors(activePanel);

  return (
    <nav
      className={`mmenu-init mm-menu mm-offcanvas ${isOpen ? "mm-opened" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mm-panels">
        {panels.map((panel) => {
          const isCurrentOpen = activePanel === panel.id;
          const isAncestor = ancestors.includes(panel.id);

          let panelClass = "mm-panel mm-hasnavbar";
          if (isCurrentOpen) panelClass += " mm-opened";
          if (isAncestor) panelClass += " mm-subopened";

          return (
            <div key={panel.id} className={panelClass}>
              <div className="mm-navbar">
                {panel.parent && (
                  <a
                    className="mm-btn mm-prev"
                    href={`#${panel.parent}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePanel(panel.parent);
                    }}
                  >
                    <span className="mm-sronly">Close</span>
                  </a>
                )}
                <a
                  className="mm-title"
                  href={`#${panel.parent || "main"}`}
                  onClick={(e) => {
                    if (panel.parent) {
                      e.preventDefault();
                      setActivePanel(panel.parent);
                    }
                  }}
                >
                  {panel.title}
                </a>
              </div>

              <ul className="mm-listview">
                {panel.items.map((item, idx) => {
                  const hasSub = item.children && item.children.length > 0;
                  return (
                    <li key={idx}>
                      {hasSub && (
                        <a
                          className="mm-next mm-fullsubopen"
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActivePanel(item.id);
                          }}
                        >
                          <span className="mm-sronly">
                            Open submenu ({item.title})
                          </span>
                        </a>
                      )}
                      <Link
                        className={item.path === "/" ? "current" : ""}
                        to={item.path}
                        onClick={() => onClose?.()}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileMenu;
