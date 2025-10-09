// Hooks.ts
import { RefObject, useContext, useEffect, useState } from "react";
import { ThemeContextType } from "../types/theme/theme-types";
import { ThemeContext } from "../context/ThemeContext";
import { SearchContext, SearchContextType } from "../context/Context";
import { Course } from "../types/course/course";
import { courseService } from "../services/courseService";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
};

export interface UseRelatedCoursesResult {
  relatedCourses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRelatedCourses = (
  identifier: string,
  type: "id" | "slug" = "slug",
  limit: number = 4
): UseRelatedCoursesResult => {
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (type === "id") {
        response = await courseService.getRelatedCoursesById(identifier, {
          limit,
        });
      } else {
        response = await courseService.getRelatedCoursesBySlug(identifier, {
          limit,
        });
      }

      setRelatedCourses(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch related courses"
      );
      setRelatedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identifier) {
      fetchRelatedCourses();
    }
  }, [identifier, type, limit]);

  const refetch = () => {
    fetchRelatedCourses();
  };

  return {
    relatedCourses,
    loading,
    error,
    refetch,
  };
};
