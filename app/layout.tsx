import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import IntercomProvider from "./components/IntercomProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Purpose Transformation Blueprint | Josh Terry",
  description: "8-week guided digital system to uncover purpose and direction. Black Friday special: $297 one-time payment.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Referrer for cart */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var sURL=document.referrer; if(sURL.indexOf('https://purposetransformationblueprint.com')!=0&&sURL!='')sessionStorage.setItem('source', sURL);
              var saQry={};location.search.substr(1).split('&').forEach(function(item) {saQry[item.split('=')[0]]=item.split('=')[1];})
              if(saQry['ADID']!=''&&typeof saQry['ADID']!==undefined)sessionStorage.setItem('ADID', saQry['ADID']);
              if(saQry['AFID']!=''&&typeof saQry['AFID']!==undefined)sessionStorage.setItem('AFID', saQry['AFID']);
              if(saQry['CID']!=''&&typeof saQry['CID']!==undefined)sessionStorage.setItem('CID', saQry['CID']);
              if(saQry['l']!=''&&typeof saQry['l']!==undefined)sessionStorage.setItem('l', saQry['l']);
              if(saQry['SID']!=''&&typeof saQry['SID']!==undefined)sessionStorage.setItem('SID', saQry['SID']);
              if(saQry['t']!=''&&typeof saQry['t']!==undefined)sessionStorage.setItem('t', saQry['t']);
            `,
          }}
        />
        <script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
          crossOrigin="anonymous"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              $(document).ready(function () {
                $('a').each(function () {
                  var url = $(this).attr('href');
                  if (!url || !/^https?:/.test(url)) {
                    return;
                  }
                  try {
                    var urlObj = new URL(url);
                    var host = urlObj.hostname;
                    if (
                      host != 'www.facebook.com' &&
                      host != 'www.instragram.com' &&
                      host != 'www.youtube.com'
                    ) {
                      var query_params = url.indexOf('?') != -1;
                      var l = sessionStorage.getItem('l');
                      if (l != null) {
                        url += (query_params ? '&' : '?') + 'l=' + encodeURIComponent(l);
                        query_params = true;
                      }
                      var s = sessionStorage.getItem('source');
                      if (s != null) {
                        s = s.replace(/^https?:\\/\\//, '');
                        s = s.replace(/^\\//, '');
                        url += (query_params ? '&' : '?') + 'source=' + encodeURIComponent(s);
                        query_params = true;
                      }
                      var a = sessionStorage.getItem('AFID');
                      if (a != null) {
                        url += (query_params ? '&' : '?') + 'AFID=' + encodeURIComponent(a);
                        query_params = true;
                      }
                      var c = sessionStorage.getItem('CID');
                      if (c != null) {
                        url += (query_params ? '&' : '?') + 'CID=' + encodeURIComponent(c);
                        query_params = true;
                      }
                      var sid = sessionStorage.getItem('SID');
                      if (sid != null) {
                        url += (query_params ? '&' : '?') + 'SID=' + encodeURIComponent(sid);
                      }
                      var t = sessionStorage.getItem('t');
                      if (t != null) {
                        url += (query_params ? '&' : '?') + 't=' + encodeURIComponent(t);
                      }
                      $(this).attr('href', url);
                    }
                  } catch (e) {
                    console.error('Error processing URL:', url, e);
                  }
                });
              });
            `,
          }}
        />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Analytics />
        <IntercomProvider />
      </body>
    </html>
  );
}

