import classNames from "classnames";
import React, { ReactNode, useState, ReactElement } from "react";

interface TabProps {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

interface TabSwitchProps {
  children: ReactElement<TabProps>[];
  initialTab?: number;
}

const Tab: React.FC<TabProps> = ({ label, children }) => {
  return children;
};

const TabSwitch: React.FC<TabSwitchProps> = ({ children, initialTab = 0 }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const tabs = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      onClick: () => setSelectedTab(index),
      selected: selectedTab === index,
    });
  });

  return (
    <div>
      <div className="flex flex-row gap-4">
        {tabs.map((tab, index) => {
          return (
            <p
              key={index}
              className={classNames(
                `text-sm font-semibold text-gray-2 pb-3 dark:text-white cursor-pointer`,
                {
                  "text-primary border-b-2 border-secondary":
                    tab.props.selected,
                }
              )}
              tabIndex={0}
              onKeyDown={tab.props.onClick}
              onClick={tab.props.onClick}
            >
              {tab.props.label}
            </p>
          );
        })}
      </div>
      <hr className="mb-2 w-full text-bordercolor" />

      {tabs[selectedTab].props.children}
    </div>
  );
};

export { Tab, TabSwitch };
