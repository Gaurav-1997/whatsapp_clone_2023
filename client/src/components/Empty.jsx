import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center rounded-r-lg">
      <div className="animate-pulse">
        <div className="h-[100px] w-[100px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-83.77245 -140.29175 726.0279 841.7505"
          >
            <path
              d="M407.185 336.283c-6.948-3.478-41.108-20.284-47.477-22.606-6.368-2.318-11-3.476-15.632 3.478-4.632 6.954-17.948 22.606-22.001 27.244-4.052 4.636-8.106 5.218-15.054 1.738-6.948-3.477-29.336-10.813-55.874-34.486-20.655-18.424-34.6-41.176-38.652-48.132-4.054-6.956-.434-10.716 3.045-14.18 3.127-3.114 6.95-8.116 10.423-12.174 3.474-4.056 4.632-6.956 6.948-11.59 2.316-4.639 1.158-8.695-.58-12.172-1.736-3.478-15.632-37.679-21.422-51.592-5.64-13.547-11.368-11.712-15.633-11.927-4.048-.201-8.685-.244-13.316-.244-4.632 0-12.16 1.739-18.53 8.693-6.367 6.956-24.317 23.767-24.317 57.964 0 34.202 24.896 67.239 28.371 71.876 3.475 4.639 48.993 74.818 118.695 104.914 16.576 7.16 29.518 11.434 39.609 14.636 16.644 5.289 31.79 4.542 43.763 2.753 13.349-1.993 41.108-16.807 46.898-33.036 5.79-16.233 5.79-30.144 4.052-33.041-1.736-2.899-6.368-4.638-13.316-8.116m-126.776 173.1h-.093c-41.473-.016-82.15-11.159-117.636-32.216l-8.44-5.01-87.475 22.947 23.348-85.288-5.494-8.745c-23.136-36.798-35.356-79.328-35.338-123 .051-127.431 103.734-231.106 231.22-231.106 61.734.022 119.763 24.094 163.402 67.782 43.636 43.685 67.653 101.754 67.629 163.51-.052 127.442-103.733 231.126-231.123 231.126M477.113 81.55C424.613 28.989 354.795.03 280.407 0 127.136 0 2.392 124.736 2.33 278.053c-.02 49.011 12.784 96.847 37.118 139.019L0 561.167l147.41-38.668c40.617 22.153 86.346 33.83 132.886 33.845h.115c153.254 0 278.009-124.748 278.072-278.068.028-74.301-28.87-144.165-81.37-196.725"
              fill="#455a64"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Empty;
