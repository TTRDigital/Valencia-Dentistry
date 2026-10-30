import { site } from "@/lib/site";

/**
 * Google Tag Manager, loaded after the first interaction (pointer, key,
 * scroll, touch) or when the browser is idle 6s after load, so it never
 * blocks rendering or competes with the LCP image. The dataLayer is created
 * at once, so events pushed before GTM loads are not lost.
 */
export function Analytics() {
  const id = site.gtmId;
  if (!id || !/^GTM-[A-Z0-9]+$/.test(id)) return null;
  const js = `window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});(function(){var d=0;function l(){if(d)return;d=1;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${id}';document.head.appendChild(s)}['pointerdown','keydown','scroll','touchstart'].forEach(function(e){addEventListener(e,l,{once:true,passive:true})});addEventListener('load',function(){('requestIdleCallback'in window?requestIdleCallback:setTimeout)(function(){setTimeout(l,6000)})})})();`;
  return <script id="gtm-loader" dangerouslySetInnerHTML={{ __html: js }} />;
}
