import { Components, Theme } from '@mui/material/styles';

export default function getComponentStyles(theme: Theme): Components {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          height: '100%',
          width: '100%'
        },
        body: {
          height: '100%',
          width: '100%',
          backgroundColor: theme.palette.background.default,
          ...(theme.palette.mode === 'light'
            ? {
                backgroundImage: 'radial-gradient(at 50% 0%, rgba(33, 150, 243, 0.05) 0%, transparent 75%), radial-gradient(at 100% 0%, rgba(63, 81, 181, 0.05) 0%, transparent 50%)'
              }
            : {
                backgroundImage: 'radial-gradient(at 50% 0%, rgba(3, 169, 244, 0.13) 0%, transparent 75%), radial-gradient(at 100% 0%, rgba(63, 81, 181, 0.13) 0%, transparent 50%)'
              })
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          height: '100%',
          cursor: 'pointer',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)'
          }`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 4px 16px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.6)'
              : '0 8px 32px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(0, 0, 0, 0.08)'
            }`
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(1.5),
          '& .word-text': {
            fontWeight: 700,
            lineHeight: 1.3,
            fontSize: '1.75rem',
            letterSpacing: '-0.01em',
            color: theme.palette.text.primary
          },
          '& .part-of-speech': {
            fontSize: '0.875rem',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.04)',
            padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
            borderRadius: theme.shape.borderRadius,
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            color: theme.palette.text.secondary
          },
          '& .meaning-text': {
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.6,
            opacity: 0.9,
            marginTop: theme.spacing(0.5),
            color: theme.palette.text.primary
          }
        }
      }
    },
    MuiRating: {
      styleOverrides: {
        root: {
          '& .MuiRating-icon': {
            color: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.1)',
            transition: 'color 0.2s ease-in-out'
          },
          '& .MuiRating-iconFilled': {
            color: theme.palette.primary.main
          },
          '& .MuiRating-iconHover': {
            color: theme.palette.primary.light
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '2.5rem',
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: '-0.02em'
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: '-0.01em'
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 500,
          lineHeight: 1.35
        },
        h6: {
          fontSize: '1.125rem',
          fontWeight: 500,
          lineHeight: 1.4
        },
        button: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.04)'
              : 'rgba(0, 0, 0, 0.04)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)'
          }`
        },
        elevation1: {
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)'
        },
        elevation2: {
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 4px 16px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)',
            transform: 'scale(1.05)'
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          marginTop: theme.spacing(0.5),
          minWidth: '200px',
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.08)'
          }`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.6)'
            : '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
          padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
            transform: 'translateX(4px)'
          },
          '&:first-of-type': {
            marginTop: theme.spacing(1)
          },
          '&:last-of-type': {
            marginBottom: theme.spacing(1)
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.9)'
            : 'rgba(50, 50, 50, 0.9)',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`
        },
        arrow: {
          color: theme.palette.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.9)'
            : 'rgba(50, 50, 50, 0.9)'
        }
      }
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.7)'
              : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 4px 16px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 6px 20px rgba(0, 0, 0, 0.5)'
              : '0 6px 20px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    }
  };
}