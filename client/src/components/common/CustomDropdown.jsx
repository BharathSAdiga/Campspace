import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomDropdown — Liquid glass themed replacement for native HTML select
 * Matches the CampSpace monochrome + orange accent design system.
 */
export const CustomDropdown = ({
  options = [],
  value,
  onChange,
  icon = null,
  placeholder = 'Select option',
  ariaLabel = 'Select option',
  className = '',
  buttonStyle = {},
  menuStyle = {},
  size = 'md', // 'sm' | 'md'
  fullWidth = false,
  align = 'left', // 'left' | 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => {
    const optValue = typeof opt === 'object' ? (opt.value ?? opt.id) : opt;
    return optValue === value;
  });

  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder;

  const SelectedIcon =
    selectedOption && typeof selectedOption === 'object' && selectedOption.icon
      ? selectedOption.icon
      : null;

  const handleSelect = (opt) => {
    const optValue = typeof opt === 'object' ? (opt.value ?? opt.id) : opt;
    onChange(optValue);
    setIsOpen(false);
  };

  const isSmall = size === 'sm';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-block',
        width: fullWidth ? '100%' : 'auto',
        zIndex: isOpen ? 9999 : 1,
      }}
      className={className}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          width: fullWidth ? '100%' : 'auto',
          minHeight: isSmall ? '36px' : '44px',
          padding: isSmall ? '0.35rem 0.85rem' : '0.65rem 1rem',
          backgroundColor: isOpen ? 'var(--bg-surface-hover, #1a1a22)' : 'var(--bg-input, #101014)',
          color: 'var(--text-primary, #fcfcfd)',
          border: isOpen
            ? '1px solid var(--accent-orange)'
            : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm, 4px)',
          fontSize: isSmall ? '0.8125rem' : '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          boxShadow: isOpen
            ? '0 0 0 3px var(--accent-orange-subtle), 0 4px 12px rgba(0, 0, 0, 0.2)'
            : '0 1px 2px rgba(0, 0, 0, 0.05)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          ...buttonStyle,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-hover)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {SelectedIcon ? (
            <SelectedIcon size={16} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
          ) : icon ? (
            <span style={{ color: 'var(--accent-orange)', display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
          ) : null}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayLabel}</span>
        </span>
        <ChevronDown
          size={15}
          style={{
            color: isOpen ? 'var(--accent-orange)' : 'var(--text-muted)',
            transition: 'transform 0.2s ease, color 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
            marginLeft: '0.5rem',
          }}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            width: fullWidth ? '100%' : 'max-content',
            minWidth: '100%',
            maxWidth: fullWidth ? '100%' : '420px',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-surface-elevated, #16161c)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--liquid-glass-border, rgba(255, 255, 255, 0.15))',
            borderRadius: 'var(--radius-md, 6px)',
            boxShadow:
              '0 16px 48px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.35)',
            padding: '0.4rem',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            ...menuStyle,
          }}
        >
          {options.map((opt, idx) => {
            const optValue = typeof opt === 'object' ? (opt.value ?? opt.id) : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const OptIcon = typeof opt === 'object' ? opt.icon : null;
            const isSelected = optValue === value;

            return (
              <div
                key={idx}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-xs, 3px)',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? 'var(--accent-orange)' : 'var(--text-primary, #fcfcfd)',
                  backgroundColor: isSelected
                    ? 'var(--accent-orange-subtle, rgba(255, 138, 61, 0.14))'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover, rgba(255, 255, 255, 0.08))';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-primary, #fcfcfd)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', flex: 1 }}>
                  {OptIcon && <OptIcon size={15} style={{ color: isSelected ? 'var(--accent-orange)' : 'var(--text-muted)', flexShrink: 0 }} />}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', lineHeight: 1.35, textAlign: 'left' }}>
                    {optLabel}
                  </span>
                </div>
                {isSelected && (
                  <Check
                    size={14}
                    style={{ color: 'var(--accent-orange)', flexShrink: 0 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
