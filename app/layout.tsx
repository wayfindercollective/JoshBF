import type { Metadata, Viewport } from "next";
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
       <html lang="en" className={`${inter.variable} ${orbitron.variable} ${plexMono.variable}`}>
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
                  var host = $(this).prop('href', url).prop('hostname');
                  if (
                    host != 'www.facebook.com' &&
                    host != 'www.instragram.com' &&
                    host != 'www.youtube.com' &&
                    /^http/.test(url)
                  ) {
                    var query_params = url.indexOf('?') != -1;
                    var l = sessionStorage.getItem('l');
                    if (l != null) {
                      url += '&l=' + l;
                    }
                    var s = sessionStorage.getItem('source');
                    if (s != null) {
                      s = s.replace('https://', '');
                      s = s.replace('http://', '');
                      s = s.replace('/', '');
                      url += '&source=' + s;
                    }
                    var a = sessionStorage.getItem('AFID');
                    if (a != null) {
                      url += '&AFID=' + a;
                    }
                    var c = sessionStorage.getItem('CID');
                    if (c != null) {
                      url += '&CID=' + c;
                    }
                    var sid = sessionStorage.getItem('SID');
                    if (sid != null) {
                      url += '&SID=' + sid;
                    }
                    $(this).attr('href', query_params ? url : url.replace(/&/, '?'));
                  }
                });
              });
            `,
          }}
        />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}

