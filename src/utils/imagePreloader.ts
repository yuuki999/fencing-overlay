/**
 * Image preloader utility to cache images before they are displayed
 * これは使用してもそんなにパフォーマンス改善しなかったので未使用。念の為残しておく。
 */

export class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();

  private constructor() {}

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  /**
   * Preload a single image
   */
  async preloadImage(src: string): Promise<void> {
    // Return if already loaded
    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Create loading promise
    const loadPromise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.set(src, img);
        this.loadingPromises.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      // Start loading
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  /**
   * Preload multiple images
   */
  async preloadImages(srcs: string[]): Promise<void> {
    const promises = srcs.map(src => this.preloadImage(src));
    await Promise.all(promises);
  }

  /**
   * Check if an image is already preloaded
   */
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  /**
   * Get all score lamp image paths
   */
  static getScoreLampImagePaths(): string[] {
    const types = ['attaque', 'riposte', 'contre-attaque'];
    const sides = ['left', 'right'];
    const paths: string[] = [];

    for (const type of types) {
      for (const side of sides) {
        // Valid score
        paths.push(`/score_images/${type}-${side}.png`);
        // Invalid score
        paths.push(`/score_images/${type}-non-valable-${side}.png`);
      }
    }

    return paths;
  }
}