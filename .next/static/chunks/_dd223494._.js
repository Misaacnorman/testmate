(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/ui/table.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Table": (()=>Table),
    "TableBody": (()=>TableBody),
    "TableCaption": (()=>TableCaption),
    "TableCell": (()=>TableCell),
    "TableFooter": (()=>TableFooter),
    "TableHead": (()=>TableHead),
    "TableHeader": (()=>TableHeader),
    "TableRow": (()=>TableRow)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 11,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, this));
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, this));
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, this));
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, this));
_c7 = TableFooter;
TableFooter.displayName = "TableFooter";
const TableRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 59,
        columnNumber: 3
    }, this));
_c9 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-12 px-4 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, this));
_c11 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 89,
        columnNumber: 3
    }, this));
_c13 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c14 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, this));
_c15 = TableCaption;
TableCaption.displayName = "TableCaption";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableFooter$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableFooter");
__turbopack_context__.k.register(_c8, "TableRow$React.forwardRef");
__turbopack_context__.k.register(_c9, "TableRow");
__turbopack_context__.k.register(_c10, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c11, "TableHead");
__turbopack_context__.k.register(_c12, "TableCell$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCell");
__turbopack_context__.k.register(_c14, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c15, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/logs/[id]/components/sample-receipt.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "SampleReceipt": (()=>SampleReceipt)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-to-print/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$test$2d$tube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TestTube$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/test-tube.js [app-client] (ecmascript) <export default as TestTube>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$microscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Microscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/microscope.js [app-client] (ecmascript) <export default as Microscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function SampleReceipt({ data }) {
    _s();
    const componentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handlePrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactToPrint"])({
        content: {
            "SampleReceipt.useReactToPrint[handlePrint]": ()=>componentRef.current
        }["SampleReceipt.useReactToPrint[handlePrint]"],
        documentTitle: `Sample_Receipt_${data.id}`
    });
    const parseAndFormatDate = (dateString, formatString = 'PPP')=>{
        if (!dateString) return 'N/A';
        try {
            const date = dateString.includes('T') ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseISO"])(dateString) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseISO"])(dateString.replace(' ', 'T'));
            if (isNaN(date.getTime())) return 'Invalid Date';
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, formatString);
        } catch (e) {
            return 'Invalid Date';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white max-w-4xl mx-auto p-8 rounded-lg shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end gap-2 mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: handlePrint,
                    variant: "outline",
                    size: "sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                            lineNumber: 35,
                            columnNumber: 17
                        }, this),
                        "Print / Save PDF"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                    lineNumber: 34,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: componentRef,
                className: "p-4 sm:p-6 lg:p-8 text-black",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex justify-between items-start pb-6 border-b-2 border-gray-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$test$2d$tube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TestTube$3e$__["TestTube"], {
                                        className: "h-16 w-16 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-4xl font-extrabold text-gray-900",
                                                children: "TestMate Inc."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 44,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "Advanced Laboratory Services"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 45,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "123 Lab Lane, Kampala, Uganda"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 46,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600",
                                                children: "contact@testmate.dev | +256 777 123456"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 47,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 43,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold uppercase text-primary",
                                        children: "Sample Receipt"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-mono",
                                        children: [
                                            "ID: ",
                                            data.id
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "my-8 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "flex items-center text-lg font-semibold border-b pb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "mr-2 h-5 w-5 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 60,
                                                        columnNumber: 91
                                                    }, this),
                                                    "Client & Project Information"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 60,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm space-y-1 pl-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Client:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 62,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.clientName,
                                                            " (",
                                                            data.clientContact,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 62,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Address:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 63,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.clientAddress
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 63,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Project:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 64,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.projectTitle
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 64,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 61,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "flex items-center text-lg font-semibold border-b pb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                        className: "mr-2 h-5 w-5 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 91
                                                    }, this),
                                                    "Billing Information"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 70,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm space-y-1 pl-2",
                                                children: data.isSameBillingClient === 'no' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Billed To:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                    lineNumber: 74,
                                                                    columnNumber: 36
                                                                }, this),
                                                                " ",
                                                                data.billingName,
                                                                " (",
                                                                data.billingContact,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                            lineNumber: 74,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Address:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                    lineNumber: 75,
                                                                    columnNumber: 36
                                                                }, this),
                                                                " ",
                                                                data.billingAddress
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                            lineNumber: 75,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Billed to the client."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                    lineNumber: 78,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 71,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 69,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "flex items-center text-lg font-semibold border-b pb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                        className: "mr-2 h-5 w-5 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 92
                                                    }, this),
                                                    "Receiving Details"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 87,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm space-y-1 pl-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Received On:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 89,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            parseAndFormatDate(data.receiptDate, 'PPP p')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Received By:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 90,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.receivedBy
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Delivered By:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 91,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.deliveredBy,
                                                            " (",
                                                            data.deliveredByContact,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Sample Status:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 92,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.sampleStatus
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 92,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 88,
                                                columnNumber: 22
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 86,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "flex items-center text-lg font-semibold border-b pb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                        className: "mr-2 h-5 w-5 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 98,
                                                        columnNumber: 92
                                                    }, this),
                                                    "Reporting Details"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 98,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm space-y-1 pl-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Results Transmittal:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 100,
                                                                columnNumber: 28
                                                            }, this),
                                                            " ",
                                                            data.transmittalModes.join(', ')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 25
                                                    }, this),
                                                    data.transmittalModes.includes('Email') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Email:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 101,
                                                                columnNumber: 72
                                                            }, this),
                                                            " ",
                                                            data.email
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 69
                                                    }, this),
                                                    data.transmittalModes.includes('Whatsapp') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Whatsapp:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 75
                                                            }, this),
                                                            " ",
                                                            data.whatsapp
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 72
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 99,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 97,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 84,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "my-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "flex items-center text-lg font-semibold border-b pb-2 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$microscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Microscope$3e$__["Microscope"], {
                                        className: "mr-2 h-5 w-5 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 109,
                                        columnNumber: 88
                                    }, this),
                                    "Tests to be Performed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-lg overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                            className: "bg-gray-100",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                        className: "w-[150px] text-center",
                                                        children: "Material Category"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                        className: "text-center",
                                                        children: "Material Test"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                        className: "text-center",
                                                        children: "Test Method(s)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                        className: "text-center",
                                                        children: "Quantity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                        className: "text-center",
                                                        children: "Concrete Details"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 113,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                            lineNumber: 112,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                            children: Object.entries(data.categories).flatMap(([category, catData])=>{
                                                const testsInCategory = Object.entries(catData.tests);
                                                if (testsInCategory.length === 0) return [];
                                                return testsInCategory.map(([testId, test], index)=>{
                                                    const specialTestDetails = data.specialData?.[category]?.[testId];
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                        children: [
                                                            index === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                rowSpan: testsInCategory.length,
                                                                className: "text-center align-middle font-medium",
                                                                children: category
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 131,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                className: "text-center",
                                                                children: test.materialTest
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 135,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                className: "text-center",
                                                                children: test.testMethods
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 136,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                className: "text-center",
                                                                children: test.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 137,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                children: specialTestDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3 text-xs",
                                                                    children: specialTestDetails.sets.map((set, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "p-3 bg-gray-50 rounded-md border text-left",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-bold mb-1",
                                                                                    children: [
                                                                                        "Set ",
                                                                                        i + 1,
                                                                                        " (Qty: ",
                                                                                        specialTestDetails.setDistribution[i],
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                    lineNumber: 143,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Casting:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                            lineNumber: 144,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        " ",
                                                                                        parseAndFormatDate(set.castingDate, 'dd-MMM-yy')
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                    lineNumber: 144,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Testing:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                            lineNumber: 145,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        " ",
                                                                                        parseAndFormatDate(set.testingDate, 'dd-MMM-yy')
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                    lineNumber: 145,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Age:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                            lineNumber: 146,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        " ",
                                                                                        set.age || 'N/A',
                                                                                        " days"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                    lineNumber: 146,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Area:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                            lineNumber: 147,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        " ",
                                                                                        set.areaOfUse || 'N/A'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                    lineNumber: 147,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "IDs:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                            lineNumber: 148,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        " ",
                                                                                        Array.isArray(set.serials) ? set.serials.join(', ') : ''
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                                    lineNumber: 148,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, i, true, {
                                                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                            lineNumber: 142,
                                                                            columnNumber: 53
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                    lineNumber: 140,
                                                                    columnNumber: 45
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-center",
                                                                    children: "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                    lineNumber: 152,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                                lineNumber: 138,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, `${category}-${testId}`, true, {
                                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 33
                                                    }, this);
                                                });
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                            lineNumber: 121,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                    lineNumber: 111,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "my-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold border-b pb-2 mb-2",
                                children: "Notes"
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            Object.entries(data.categories).some(([_, catData])=>catData.notes) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm space-y-1",
                                children: Object.entries(data.categories).map(([category, catData])=>catData.notes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    category,
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                                lineNumber: 169,
                                                columnNumber: 47
                                            }, this),
                                            " ",
                                            catData.notes
                                        ]
                                    }, category, true, {
                                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                        lineNumber: 169,
                                        columnNumber: 29
                                    }, this) : null)
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 166,
                                columnNumber: 18
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: "No special notes provided."
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 174,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "pt-8 mt-8 border-t text-center text-xs text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Thank you for choosing TestMate Inc. for your testing needs. All samples are handled with care and precision."
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1",
                                children: "This is a system-generated receipt and does not require a signature."
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/logs/[id]/components/sample-receipt.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(SampleReceipt, "PTw1p+U7xTE5awVZ4hEdAvvJJ1k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$to$2d$print$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactToPrint"]
    ];
});
_c = SampleReceipt;
var _c;
__turbopack_context__.k.register(_c, "SampleReceipt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/logs/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LogPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f5b$id$5d2f$components$2f$sample$2d$receipt$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/logs/[id]/components/sample-receipt.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function LogPage({ params }) {
    _s();
    const { id } = params;
    const [receiptData, setReceiptData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LogPage.useEffect": ()=>{
            const fetchReceipt = {
                "LogPage.useEffect.fetchReceipt": async ()=>{
                    if (!id) return;
                    try {
                        const docRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'receipts', id);
                        const docSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(docRef);
                        if (docSnap.exists()) {
                            const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromFirestore"])({
                                id: docSnap.id,
                                ...docSnap.data()
                            });
                            setReceiptData(data);
                        } else {
                            setReceiptData(null);
                        }
                    } catch (error) {
                        console.error("Error fetching receipt:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["LogPage.useEffect.fetchReceipt"];
            fetchReceipt();
        }
    }["LogPage.useEffect"], [
        id
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center",
            children: "Loading receipt..."
        }, void 0, false, {
            fileName: "[project]/src/app/logs/[id]/page.tsx",
            lineNumber: 42,
            columnNumber: 12
        }, this);
    }
    if (!receiptData) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 sm:p-6 lg:p-8 bg-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f5b$id$5d2f$components$2f$sample$2d$receipt$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SampleReceipt"], {
            data: receiptData
        }, void 0, false, {
            fileName: "[project]/src/app/logs/[id]/page.tsx",
            lineNumber: 51,
            columnNumber: 8
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/logs/[id]/page.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(LogPage, "+AuzqZImS1SsLnRbULbxuw4eq7I=");
_c = LogPage;
var _c;
__turbopack_context__.k.register(_c, "LogPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/date-fns/parseISO.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "parseISO": (()=>parseISO)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/constants.mjs [app-client] (ecmascript)");
;
function parseISO(argument, options) {
    const additionalDigits = options?.additionalDigits ?? 2;
    const dateStrings = splitDateString(argument);
    let date;
    if (dateStrings.date) {
        const parseYearResult = parseYear(dateStrings.date, additionalDigits);
        date = parseDate(parseYearResult.restDateString, parseYearResult.year);
    }
    if (!date || isNaN(date.getTime())) {
        return new Date(NaN);
    }
    const timestamp = date.getTime();
    let time = 0;
    let offset;
    if (dateStrings.time) {
        time = parseTime(dateStrings.time);
        if (isNaN(time)) {
            return new Date(NaN);
        }
    }
    if (dateStrings.timezone) {
        offset = parseTimezone(dateStrings.timezone);
        if (isNaN(offset)) {
            return new Date(NaN);
        }
    } else {
        const dirtyDate = new Date(timestamp + time);
        // JS parsed string assuming it's in UTC timezone
        // but we need it to be parsed in our timezone
        // so we use utc values to build date in our timezone.
        // Year values from 0 to 99 map to the years 1900 to 1999
        // so set year explicitly with setFullYear.
        const result = new Date(0);
        result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
        result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
        return result;
    }
    return new Date(timestamp + time + offset);
}
const patterns = {
    dateTimeDelimiter: /[T ]/,
    timeZoneDelimiter: /[Z ]/i,
    timezone: /([Z+-].*)$/
};
const dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
const timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
    const dateStrings = {};
    const array = dateString.split(patterns.dateTimeDelimiter);
    let timeString;
    // The regex match should only return at maximum two array elements.
    // [date], [time], or [date, time].
    if (array.length > 2) {
        return dateStrings;
    }
    if (/:/.test(array[0])) {
        timeString = array[0];
    } else {
        dateStrings.date = array[0];
        timeString = array[1];
        if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
            dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
            timeString = dateString.substr(dateStrings.date.length, dateString.length);
        }
    }
    if (timeString) {
        const token = patterns.timezone.exec(timeString);
        if (token) {
            dateStrings.time = timeString.replace(token[1], "");
            dateStrings.timezone = token[1];
        } else {
            dateStrings.time = timeString;
        }
    }
    return dateStrings;
}
function parseYear(dateString, additionalDigits) {
    const regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
    const captures = dateString.match(regex);
    // Invalid ISO-formatted year
    if (!captures) return {
        year: NaN,
        restDateString: ""
    };
    const year = captures[1] ? parseInt(captures[1]) : null;
    const century = captures[2] ? parseInt(captures[2]) : null;
    // either year or century is null, not both
    return {
        year: century === null ? year : century * 100,
        restDateString: dateString.slice((captures[1] || captures[2]).length)
    };
}
function parseDate(dateString, year) {
    // Invalid ISO-formatted year
    if (year === null) return new Date(NaN);
    const captures = dateString.match(dateRegex);
    // Invalid ISO-formatted string
    if (!captures) return new Date(NaN);
    const isWeekDate = !!captures[4];
    const dayOfYear = parseDateUnit(captures[1]);
    const month = parseDateUnit(captures[2]) - 1;
    const day = parseDateUnit(captures[3]);
    const week = parseDateUnit(captures[4]);
    const dayOfWeek = parseDateUnit(captures[5]) - 1;
    if (isWeekDate) {
        if (!validateWeekDate(year, week, dayOfWeek)) {
            return new Date(NaN);
        }
        return dayOfISOWeekYear(year, week, dayOfWeek);
    } else {
        const date = new Date(0);
        if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
            return new Date(NaN);
        }
        date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
        return date;
    }
}
function parseDateUnit(value) {
    return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
    const captures = timeString.match(timeRegex);
    if (!captures) return NaN; // Invalid ISO-formatted time
    const hours = parseTimeUnit(captures[1]);
    const minutes = parseTimeUnit(captures[2]);
    const seconds = parseTimeUnit(captures[3]);
    if (!validateTime(hours, minutes, seconds)) {
        return NaN;
    }
    return hours * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsInHour"] + minutes * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsInMinute"] + seconds * 1000;
}
function parseTimeUnit(value) {
    return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
    if (timezoneString === "Z") return 0;
    const captures = timezoneString.match(timezoneRegex);
    if (!captures) return 0;
    const sign = captures[1] === "+" ? -1 : 1;
    const hours = parseInt(captures[2]);
    const minutes = captures[3] && parseInt(captures[3]) || 0;
    if (!validateTimezone(hours, minutes)) {
        return NaN;
    }
    return sign * (hours * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsInHour"] + minutes * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsInMinute"]);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
    const date = new Date(0);
    date.setUTCFullYear(isoWeekYear, 0, 4);
    const fourthOfJanuaryDay = date.getUTCDay() || 7;
    const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
}
// Validation functions
// February is null to handle the leap year (using ||)
const daysInMonths = [
    31,
    null,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
];
function isLeapYearIndex(year) {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
    return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
    return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
    return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
    if (hours === 24) {
        return minutes === 0 && seconds === 0;
    }
    return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
    return minutes >= 0 && minutes <= 59;
}
const __TURBOPACK__default__export__ = parseISO;
}}),
"[project]/node_modules/react-to-print/lib/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
!function(e, t) {
    ("TURBOPACK compile-time truthy", 1) ? module.exports = t(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)")) : ("TURBOPACK unreachable", undefined);
}("undefined" != typeof self ? self : this, function(e, t) {
    return function() {
        "use strict";
        var r = {
            328: function(e, t, r) {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.PrintContextConsumer = t.PrintContext = void 0;
                var n = r(496), o = Object.prototype.hasOwnProperty.call(n, "createContext");
                t.PrintContext = o ? n.createContext({}) : null, t.PrintContextConsumer = t.PrintContext ? t.PrintContext.Consumer : function() {
                    return null;
                };
            },
            428: function(e, t, r) {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.ReactToPrint = void 0;
                var n = r(316), o = r(496), i = r(190), a = r(328), c = r(940), s = function(e) {
                    function t() {
                        var t = e.apply(this, n.__spreadArray([], n.__read(arguments), !1)) || this;
                        return t.startPrint = function(e) {
                            var r = t.props, n = r.onAfterPrint, o = r.onPrintError, i = r.print, a = r.documentTitle;
                            setTimeout(function() {
                                var r, c;
                                if (e.contentWindow) if (e.contentWindow.focus(), i) i(e).then(function() {
                                    return null == n ? void 0 : n();
                                }).then(function() {
                                    return t.handleRemoveIframe();
                                }).catch(function(e) {
                                    o ? o("print", e) : t.logMessages([
                                        "An error was thrown by the specified `print` function"
                                    ]);
                                });
                                else {
                                    if (e.contentWindow.print) {
                                        var s = null !== (c = null === (r = e.contentDocument) || void 0 === r ? void 0 : r.title) && void 0 !== c ? c : "", u = e.ownerDocument.title;
                                        a && (e.ownerDocument.title = a, e.contentDocument && (e.contentDocument.title = a)), e.contentWindow.print(), a && (e.ownerDocument.title = u, e.contentDocument && (e.contentDocument.title = s));
                                    } else t.logMessages([
                                        "Printing for this browser is not currently possible: the browser does not have a `print` method available for iframes."
                                    ]);
                                    null == n || n(), t.handleRemoveIframe();
                                }
                                else t.logMessages([
                                    "Printing failed because the `contentWindow` of the print iframe did not load. This is possibly an error with `react-to-print`. Please file an issue: https://github.com/gregnb/react-to-print/issues/"
                                ]);
                            }, 500);
                        }, t.triggerPrint = function(e) {
                            var r = t.props, n = r.onBeforePrint, o = r.onPrintError;
                            if (n) {
                                var i = n();
                                i && "function" == typeof i.then ? i.then(function() {
                                    t.startPrint(e);
                                }).catch(function(e) {
                                    o && o("onBeforePrint", e);
                                }) : t.startPrint(e);
                            } else t.startPrint(e);
                        }, t.handlePrint = function(e) {
                            var r = t.props, o = r.bodyClass, a = r.content, c = r.copyStyles, s = r.fonts, u = r.pageStyle, l = r.nonce, f = "function" == typeof e ? e() : null;
                            if (f && "function" == typeof a && t.logMessages([
                                '"react-to-print" received a `content` prop and a content param passed the callback return by `useReactToPrint. The `content` prop will be ignored.'
                            ], "warning"), f || "function" != typeof a || (f = a()), void 0 !== f) if (null !== f) {
                                var d = document.createElement("iframe");
                                d.width = "".concat(document.documentElement.clientWidth, "px"), d.height = "".concat(document.documentElement.clientHeight, "px"), d.style.position = "absolute", d.style.top = "-".concat(document.documentElement.clientHeight + 100, "px"), d.style.left = "-".concat(document.documentElement.clientWidth + 100, "px"), d.id = "printWindow", d.srcdoc = "<!DOCTYPE html>";
                                var p = (0, i.findDOMNode)(f);
                                if (p) {
                                    var h = p.cloneNode(!0), y = h instanceof Text, b = document.querySelectorAll("link[rel~='stylesheet'], link[as='style']"), v = y ? [] : h.querySelectorAll("img"), g = y ? [] : h.querySelectorAll("video"), m = s ? s.length : 0;
                                    t.numResourcesToLoad = b.length + v.length + g.length + m, t.resourcesLoaded = [], t.resourcesErrored = [];
                                    var _ = function(e, r) {
                                        t.resourcesLoaded.includes(e) ? t.logMessages([
                                            "Tried to mark a resource that has already been handled",
                                            e
                                        ], "debug") : (r ? (t.logMessages(n.__spreadArray([
                                            '"react-to-print" was unable to load a resource but will continue attempting to print the page'
                                        ], n.__read(r), !1)), t.resourcesErrored.push(e)) : t.resourcesLoaded.push(e), t.resourcesLoaded.length + t.resourcesErrored.length === t.numResourcesToLoad && t.triggerPrint(d));
                                    };
                                    d.onload = function() {
                                        var e, r, i, a;
                                        d.onload = null;
                                        var f = d.contentDocument || (null === (r = d.contentWindow) || void 0 === r ? void 0 : r.document);
                                        if (f) {
                                            f.body.appendChild(h), s && ((null === (i = d.contentDocument) || void 0 === i ? void 0 : i.fonts) && (null === (a = d.contentWindow) || void 0 === a ? void 0 : a.FontFace) ? s.forEach(function(e) {
                                                var t = new FontFace(e.family, e.source, {
                                                    weight: e.weight,
                                                    style: e.style
                                                });
                                                d.contentDocument.fonts.add(t), t.loaded.then(function() {
                                                    _(t);
                                                }).catch(function(e) {
                                                    _(t, [
                                                        "Failed loading the font:",
                                                        t,
                                                        "Load error:",
                                                        e
                                                    ]);
                                                });
                                            }) : (s.forEach(function(e) {
                                                return _(e);
                                            }), t.logMessages([
                                                '"react-to-print" is not able to load custom fonts because the browser does not support the FontFace API but will continue attempting to print the page'
                                            ])));
                                            var b = "function" == typeof u ? u() : u;
                                            if ("string" != typeof b) t.logMessages([
                                                '"react-to-print" expected a "string" from `pageStyle` but received "'.concat(typeof b, '". Styles from `pageStyle` will not be applied.')
                                            ]);
                                            else {
                                                var m = f.createElement("style");
                                                l && (m.setAttribute("nonce", l), f.head.setAttribute("nonce", l)), m.appendChild(f.createTextNode(b)), f.head.appendChild(m);
                                            }
                                            if (o && (e = f.body.classList).add.apply(e, n.__spreadArray([], n.__read(o.split(" ")), !1)), !y) {
                                                for(var w = y ? [] : p.querySelectorAll("canvas"), P = f.querySelectorAll("canvas"), O = 0; O < w.length; ++O){
                                                    var x = w[O], S = P[O].getContext("2d");
                                                    S && S.drawImage(x, 0, 0);
                                                }
                                                var E = function(e) {
                                                    var t = v[e], r = t.getAttribute("src");
                                                    if (r) {
                                                        var n = new Image;
                                                        n.onload = function() {
                                                            return _(t);
                                                        }, n.onerror = function(e, r, n, o, i) {
                                                            return _(t, [
                                                                "Error loading <img>",
                                                                t,
                                                                "Error",
                                                                i
                                                            ]);
                                                        }, n.src = r;
                                                    } else _(t, [
                                                        'Found an <img> tag with an empty "src" attribute. This prevents pre-loading it. The <img> is:',
                                                        t
                                                    ]);
                                                };
                                                for(O = 0; O < v.length; O++)E(O);
                                                var T = function(e) {
                                                    var t = g[e];
                                                    t.preload = "auto";
                                                    var r = t.getAttribute("poster");
                                                    if (r) {
                                                        var n = new Image;
                                                        n.onload = function() {
                                                            return _(t);
                                                        }, n.onerror = function(e, n, o, i, a) {
                                                            return _(t, [
                                                                "Error loading video poster",
                                                                r,
                                                                "for video",
                                                                t,
                                                                "Error:",
                                                                a
                                                            ]);
                                                        }, n.src = r;
                                                    } else t.readyState >= 2 ? _(t) : (t.onloadeddata = function() {
                                                        return _(t);
                                                    }, t.onerror = function(e, r, n, o, i) {
                                                        return _(t, [
                                                            "Error loading video",
                                                            t,
                                                            "Error",
                                                            i
                                                        ]);
                                                    }, t.onstalled = function() {
                                                        return _(t, [
                                                            "Loading video stalled, skipping",
                                                            t
                                                        ]);
                                                    });
                                                };
                                                for(O = 0; O < g.length; O++)T(O);
                                                var j = "input", C = p.querySelectorAll(j), A = f.querySelectorAll(j);
                                                for(O = 0; O < C.length; O++)A[O].value = C[O].value;
                                                var k = "input[type=checkbox],input[type=radio]", R = p.querySelectorAll(k), M = f.querySelectorAll(k);
                                                for(O = 0; O < R.length; O++)M[O].checked = R[O].checked;
                                                var D = "select", I = p.querySelectorAll(D), q = f.querySelectorAll(D);
                                                for(O = 0; O < I.length; O++)q[O].value = I[O].value;
                                            }
                                            if (c) for(var F = document.querySelectorAll("style, link[rel~='stylesheet'], link[as='style']"), W = function(e, r) {
                                                var n = F[e];
                                                if ("style" === n.tagName.toLowerCase()) {
                                                    var o = f.createElement(n.tagName), i = n.sheet;
                                                    if (i) {
                                                        var a = "";
                                                        try {
                                                            for(var c = i.cssRules.length, s = 0; s < c; ++s)"string" == typeof i.cssRules[s].cssText && (a += "".concat(i.cssRules[s].cssText, "\r\n"));
                                                        } catch (e) {
                                                            t.logMessages([
                                                                "A stylesheet could not be accessed. This is likely due to the stylesheet having cross-origin imports, and many browsers block script access to cross-origin stylesheets. See https://github.com/gregnb/react-to-print/issues/429 for details. You may be able to load the sheet by both marking the stylesheet with the cross `crossorigin` attribute, and setting the `Access-Control-Allow-Origin` header on the server serving the stylesheet. Alternatively, host the stylesheet on your domain to avoid this issue entirely.",
                                                                n
                                                            ], "warning");
                                                        }
                                                        o.setAttribute("id", "react-to-print-".concat(e)), l && o.setAttribute("nonce", l), o.appendChild(f.createTextNode(a)), f.head.appendChild(o);
                                                    }
                                                } else if (n.getAttribute("href")) if (n.hasAttribute("disabled")) t.logMessages([
                                                    "`react-to-print` encountered a <link> tag with a `disabled` attribute and will ignore it. Note that the `disabled` attribute is deprecated, and some browsers ignore it. You should stop using it. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-disabled. The <link> is:",
                                                    n
                                                ], "warning"), _(n);
                                                else {
                                                    for(var u = f.createElement(n.tagName), d = (s = 0, n.attributes.length); s < d; ++s){
                                                        var p = n.attributes[s];
                                                        p && u.setAttribute(p.nodeName, p.nodeValue || "");
                                                    }
                                                    u.onload = function() {
                                                        return _(u);
                                                    }, u.onerror = function(e, t, r, n, o) {
                                                        return _(u, [
                                                            "Failed to load",
                                                            u,
                                                            "Error:",
                                                            o
                                                        ]);
                                                    }, l && u.setAttribute("nonce", l), f.head.appendChild(u);
                                                }
                                                else t.logMessages([
                                                    "`react-to-print` encountered a <link> tag with an empty `href` attribute. In addition to being invalid HTML, this can cause problems in many browsers, and so the <link> was not loaded. The <link> is:",
                                                    n
                                                ], "warning"), _(n);
                                            }, L = (O = 0, F.length); O < L; ++O)W(O);
                                        }
                                        0 !== t.numResourcesToLoad && c || t.triggerPrint(d);
                                    }, t.handleRemoveIframe(!0), document.body.appendChild(d);
                                } else t.logMessages([
                                    '"react-to-print" could not locate the DOM node corresponding with the `content` prop'
                                ]);
                            } else t.logMessages([
                                'There is nothing to print because the "content" prop returned "null". Please ensure "content" is renderable before allowing "react-to-print" to be called.'
                            ]);
                            else t.logMessages([
                                "To print a functional component ensure it is wrapped with `React.forwardRef`, and ensure the forwarded ref is used. See the README for an example: https://github.com/gregnb/react-to-print#examples"
                            ]);
                        }, t.handleRemoveIframe = function(e) {
                            var r = t.props.removeAfterPrint;
                            if (e || r) {
                                var n = document.getElementById("printWindow");
                                n && document.body.removeChild(n);
                            }
                        }, t.logMessages = function(e, r) {
                            void 0 === r && (r = "error"), t.props.suppressErrors || ("error" === r ? console.error(e) : "warning" === r ? console.warn(e) : "debug" === r && console.debug(e));
                        }, t;
                    }
                    return n.__extends(t, e), t.prototype.handleClick = function(e, t) {
                        var r = this, n = this.props, o = n.onBeforeGetContent, i = n.onPrintError;
                        if (o) {
                            var a = o();
                            a && "function" == typeof a.then ? a.then(function() {
                                return r.handlePrint(t);
                            }).catch(function(e) {
                                i && i("onBeforeGetContent", e);
                            }) : this.handlePrint(t);
                        } else this.handlePrint(t);
                    }, t.prototype.render = function() {
                        var e = this.props, t = e.children, r = e.trigger;
                        if (r) return o.cloneElement(r(), {
                            onClick: this.handleClick.bind(this)
                        });
                        if (!a.PrintContext) return this.logMessages([
                            '"react-to-print" requires React ^16.3.0 to be able to use "PrintContext"'
                        ]), null;
                        var n = {
                            handlePrint: this.handleClick.bind(this)
                        };
                        return o.createElement(a.PrintContext.Provider, {
                            value: n
                        }, t);
                    }, t.defaultProps = c.defaultProps, t;
                }(o.Component);
                t.ReactToPrint = s;
            },
            940: function(e, t) {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.defaultProps = void 0, t.defaultProps = {
                    copyStyles: !0,
                    pageStyle: "\n        @page {\n            /* Remove browser default header (title) and footer (url) */\n            margin: 0;\n        }\n        @media print {\n            body {\n                /* Tell browsers to print background colors */\n                -webkit-print-color-adjust: exact; /* Chrome/Safari/Edge/Opera */\n                color-adjust: exact; /* Firefox */\n            }\n        }\n    ",
                    removeAfterPrint: !1,
                    suppressErrors: !1
                };
            },
            892: function(e, t, r) {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.useReactToPrint = void 0;
                var n = r(316), o = r(496), i = r(428), a = r(940), c = r(860), s = Object.prototype.hasOwnProperty.call(o, "useMemo") && Object.prototype.hasOwnProperty.call(o, "useCallback");
                t.useReactToPrint = function(e) {
                    if (!s) return e.suppressErrors || console.error('"react-to-print" requires React ^16.8.0 to be able to use "useReactToPrint"'), function() {
                        throw new Error('"react-to-print" requires React ^16.8.0 to be able to use "useReactToPrint"');
                    };
                    var t = o.useMemo({
                        "useMemo[t]": function() {
                            return new i.ReactToPrint(n.__assign(n.__assign({}, a.defaultProps), e));
                        }
                    }["useMemo[t]"], [
                        e
                    ]);
                    return o.useCallback(function(e, r) {
                        return (0, c.wrapCallbackWithArgs)(t, t.handleClick, r)(e);
                    }, [
                        t
                    ]);
                };
            },
            860: function(e, t, r) {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.wrapCallbackWithArgs = void 0;
                var n = r(316);
                t.wrapCallbackWithArgs = function(e, t) {
                    for(var r = [], o = 2; o < arguments.length; o++)r[o - 2] = arguments[o];
                    return function() {
                        for(var o = [], i = 0; i < arguments.length; i++)o[i] = arguments[i];
                        return t.apply(e, n.__spreadArray(n.__spreadArray([], n.__read(o), !1), n.__read(r), !1));
                    };
                };
            },
            496: function(t) {
                t.exports = e;
            },
            190: function(e) {
                e.exports = t;
            },
            316: function(e, t, r) {
                r.r(t), r.d(t, {
                    __addDisposableResource: function() {
                        return D;
                    },
                    __assign: function() {
                        return i;
                    },
                    __asyncDelegator: function() {
                        return S;
                    },
                    __asyncGenerator: function() {
                        return x;
                    },
                    __asyncValues: function() {
                        return E;
                    },
                    __await: function() {
                        return O;
                    },
                    __awaiter: function() {
                        return h;
                    },
                    __classPrivateFieldGet: function() {
                        return k;
                    },
                    __classPrivateFieldIn: function() {
                        return M;
                    },
                    __classPrivateFieldSet: function() {
                        return R;
                    },
                    __createBinding: function() {
                        return b;
                    },
                    __decorate: function() {
                        return c;
                    },
                    __disposeResources: function() {
                        return q;
                    },
                    __esDecorate: function() {
                        return u;
                    },
                    __exportStar: function() {
                        return v;
                    },
                    __extends: function() {
                        return o;
                    },
                    __generator: function() {
                        return y;
                    },
                    __importDefault: function() {
                        return A;
                    },
                    __importStar: function() {
                        return C;
                    },
                    __makeTemplateObject: function() {
                        return T;
                    },
                    __metadata: function() {
                        return p;
                    },
                    __param: function() {
                        return s;
                    },
                    __propKey: function() {
                        return f;
                    },
                    __read: function() {
                        return m;
                    },
                    __rest: function() {
                        return a;
                    },
                    __runInitializers: function() {
                        return l;
                    },
                    __setFunctionName: function() {
                        return d;
                    },
                    __spread: function() {
                        return _;
                    },
                    __spreadArray: function() {
                        return P;
                    },
                    __spreadArrays: function() {
                        return w;
                    },
                    __values: function() {
                        return g;
                    }
                });
                var n = function(e, t) {
                    return n = Object.setPrototypeOf || ({
                        __proto__: []
                    }) instanceof Array && function(e, t) {
                        e.__proto__ = t;
                    } || function(e, t) {
                        for(var r in t)Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                    }, n(e, t);
                };
                function o(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                    function r() {
                        this.constructor = e;
                    }
                    n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r);
                }
                var i = function() {
                    return i = Object.assign || function(e) {
                        for(var t, r = 1, n = arguments.length; r < n; r++)for(var o in t = arguments[r])Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
                        return e;
                    }, i.apply(this, arguments);
                };
                function a(e, t) {
                    var r = {};
                    for(var n in e)Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
                    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                        var o = 0;
                        for(n = Object.getOwnPropertySymbols(e); o < n.length; o++)t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
                    }
                    return r;
                }
                function c(e, t, r, n) {
                    var o, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n);
                    else for(var c = e.length - 1; c >= 0; c--)(o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, r, a) : o(t, r)) || a);
                    return i > 3 && a && Object.defineProperty(t, r, a), a;
                }
                function s(e, t) {
                    return function(r, n) {
                        t(r, n, e);
                    };
                }
                function u(e, t, r, n, o, i) {
                    function a(e) {
                        if (void 0 !== e && "function" != typeof e) throw new TypeError("Function expected");
                        return e;
                    }
                    for(var c, s = n.kind, u = "getter" === s ? "get" : "setter" === s ? "set" : "value", l = !t && e ? n.static ? e : e.prototype : null, f = t || (l ? Object.getOwnPropertyDescriptor(l, n.name) : {}), d = !1, p = r.length - 1; p >= 0; p--){
                        var h = {};
                        for(var y in n)h[y] = "access" === y ? {} : n[y];
                        for(var y in n.access)h.access[y] = n.access[y];
                        h.addInitializer = function(e) {
                            if (d) throw new TypeError("Cannot add initializers after decoration has completed");
                            i.push(a(e || null));
                        };
                        var b = (0, r[p])("accessor" === s ? {
                            get: f.get,
                            set: f.set
                        } : f[u], h);
                        if ("accessor" === s) {
                            if (void 0 === b) continue;
                            if (null === b || "object" != typeof b) throw new TypeError("Object expected");
                            (c = a(b.get)) && (f.get = c), (c = a(b.set)) && (f.set = c), (c = a(b.init)) && o.unshift(c);
                        } else (c = a(b)) && ("field" === s ? o.unshift(c) : f[u] = c);
                    }
                    l && Object.defineProperty(l, n.name, f), d = !0;
                }
                function l(e, t, r) {
                    for(var n = arguments.length > 2, o = 0; o < t.length; o++)r = n ? t[o].call(e, r) : t[o].call(e);
                    return n ? r : void 0;
                }
                function f(e) {
                    return "symbol" == typeof e ? e : "".concat(e);
                }
                function d(e, t, r) {
                    return "symbol" == typeof t && (t = t.description ? "[".concat(t.description, "]") : ""), Object.defineProperty(e, "name", {
                        configurable: !0,
                        value: r ? "".concat(r, " ", t) : t
                    });
                }
                function p(e, t) {
                    if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t);
                }
                function h(e, t, r, n) {
                    return new (r || (r = Promise))(function(o, i) {
                        function a(e) {
                            try {
                                s(n.next(e));
                            } catch (e) {
                                i(e);
                            }
                        }
                        function c(e) {
                            try {
                                s(n.throw(e));
                            } catch (e) {
                                i(e);
                            }
                        }
                        function s(e) {
                            var t;
                            e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
                                e(t);
                            })).then(a, c);
                        }
                        s((n = n.apply(e, t || [])).next());
                    });
                }
                function y(e, t) {
                    var r, n, o, i, a = {
                        label: 0,
                        sent: function() {
                            if (1 & o[0]) throw o[1];
                            return o[1];
                        },
                        trys: [],
                        ops: []
                    };
                    return i = {
                        next: c(0),
                        throw: c(1),
                        return: c(2)
                    }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                        return this;
                    }), i;
                    "TURBOPACK unreachable";
                    function c(c) {
                        return function(s) {
                            return function(c) {
                                if (r) throw new TypeError("Generator is already executing.");
                                for(; i && (i = 0, c[0] && (a = 0)), a;)try {
                                    if (r = 1, n && (o = 2 & c[0] ? n.return : c[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, c[1])).done) return o;
                                    switch(n = 0, o && (c = [
                                        2 & c[0],
                                        o.value
                                    ]), c[0]){
                                        case 0:
                                        case 1:
                                            o = c;
                                            break;
                                        case 4:
                                            return a.label++, {
                                                value: c[1],
                                                done: !1
                                            };
                                        case 5:
                                            a.label++, n = c[1], c = [
                                                0
                                            ];
                                            continue;
                                        case 7:
                                            c = a.ops.pop(), a.trys.pop();
                                            continue;
                                        default:
                                            if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                                                a = 0;
                                                continue;
                                            }
                                            if (3 === c[0] && (!o || c[1] > o[0] && c[1] < o[3])) {
                                                a.label = c[1];
                                                break;
                                            }
                                            if (6 === c[0] && a.label < o[1]) {
                                                a.label = o[1], o = c;
                                                break;
                                            }
                                            if (o && a.label < o[2]) {
                                                a.label = o[2], a.ops.push(c);
                                                break;
                                            }
                                            o[2] && a.ops.pop(), a.trys.pop();
                                            continue;
                                    }
                                    c = t.call(e, a);
                                } catch (e) {
                                    c = [
                                        6,
                                        e
                                    ], n = 0;
                                } finally{
                                    r = o = 0;
                                }
                                if (5 & c[0]) throw c[1];
                                return {
                                    value: c[0] ? c[1] : void 0,
                                    done: !0
                                };
                            }([
                                c,
                                s
                            ]);
                        };
                    }
                }
                var b = Object.create ? function(e, t, r, n) {
                    void 0 === n && (n = r);
                    var o = Object.getOwnPropertyDescriptor(t, r);
                    o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                        enumerable: !0,
                        get: function() {
                            return t[r];
                        }
                    }), Object.defineProperty(e, n, o);
                } : function(e, t, r, n) {
                    void 0 === n && (n = r), e[n] = t[r];
                };
                function v(e, t) {
                    for(var r in e)"default" === r || Object.prototype.hasOwnProperty.call(t, r) || b(t, e, r);
                }
                function g(e) {
                    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
                    if (r) return r.call(e);
                    if (e && "number" == typeof e.length) return {
                        next: function() {
                            return e && n >= e.length && (e = void 0), {
                                value: e && e[n++],
                                done: !e
                            };
                        }
                    };
                    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
                }
                function m(e, t) {
                    var r = "function" == typeof Symbol && e[Symbol.iterator];
                    if (!r) return e;
                    var n, o, i = r.call(e), a = [];
                    try {
                        for(; (void 0 === t || t-- > 0) && !(n = i.next()).done;)a.push(n.value);
                    } catch (e) {
                        o = {
                            error: e
                        };
                    } finally{
                        try {
                            n && !n.done && (r = i.return) && r.call(i);
                        } finally{
                            if (o) throw o.error;
                        }
                    }
                    return a;
                }
                function _() {
                    for(var e = [], t = 0; t < arguments.length; t++)e = e.concat(m(arguments[t]));
                    return e;
                }
                function w() {
                    for(var e = 0, t = 0, r = arguments.length; t < r; t++)e += arguments[t].length;
                    var n = Array(e), o = 0;
                    for(t = 0; t < r; t++)for(var i = arguments[t], a = 0, c = i.length; a < c; a++, o++)n[o] = i[a];
                    return n;
                }
                function P(e, t, r) {
                    if (r || 2 === arguments.length) for(var n, o = 0, i = t.length; o < i; o++)!n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
                    return e.concat(n || Array.prototype.slice.call(t));
                }
                function O(e) {
                    return this instanceof O ? (this.v = e, this) : new O(e);
                }
                function x(e, t, r) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var n, o = r.apply(e, t || []), i = [];
                    return n = {}, a("next"), a("throw"), a("return"), n[Symbol.asyncIterator] = function() {
                        return this;
                    }, n;
                    "TURBOPACK unreachable";
                    function a(e) {
                        o[e] && (n[e] = function(t) {
                            return new Promise(function(r, n) {
                                i.push([
                                    e,
                                    t,
                                    r,
                                    n
                                ]) > 1 || c(e, t);
                            });
                        });
                    }
                    function c(e, t) {
                        try {
                            (r = o[e](t)).value instanceof O ? Promise.resolve(r.value.v).then(s, u) : l(i[0][2], r);
                        } catch (e) {
                            l(i[0][3], e);
                        }
                        var r;
                    }
                    function s(e) {
                        c("next", e);
                    }
                    function u(e) {
                        c("throw", e);
                    }
                    function l(e, t) {
                        e(t), i.shift(), i.length && c(i[0][0], i[0][1]);
                    }
                }
                function S(e) {
                    var t, r;
                    return t = {}, n("next"), n("throw", function(e) {
                        throw e;
                    }), n("return"), t[Symbol.iterator] = function() {
                        return this;
                    }, t;
                    "TURBOPACK unreachable";
                    function n(n, o) {
                        t[n] = e[n] ? function(t) {
                            return (r = !r) ? {
                                value: O(e[n](t)),
                                done: !1
                            } : o ? o(t) : t;
                        } : o;
                    }
                }
                function E(e) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var t, r = e[Symbol.asyncIterator];
                    return r ? r.call(e) : (e = g(e), t = {}, n("next"), n("throw"), n("return"), t[Symbol.asyncIterator] = function() {
                        return this;
                    }, t);
                    "TURBOPACK unreachable";
                    function n(r) {
                        t[r] = e[r] && function(t) {
                            return new Promise(function(n, o) {
                                !function(e, t, r, n) {
                                    Promise.resolve(n).then(function(t) {
                                        e({
                                            value: t,
                                            done: r
                                        });
                                    }, t);
                                }(n, o, (t = e[r](t)).done, t.value);
                            });
                        };
                    }
                }
                function T(e, t) {
                    return Object.defineProperty ? Object.defineProperty(e, "raw", {
                        value: t
                    }) : e.raw = t, e;
                }
                var j = Object.create ? function(e, t) {
                    Object.defineProperty(e, "default", {
                        enumerable: !0,
                        value: t
                    });
                } : function(e, t) {
                    e.default = t;
                };
                function C(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e) for(var r in e)"default" !== r && Object.prototype.hasOwnProperty.call(e, r) && b(t, e, r);
                    return j(t, e), t;
                }
                function A(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    };
                }
                function k(e, t, r, n) {
                    if ("a" === r && !n) throw new TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof t ? e !== t || !n : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e);
                }
                function R(e, t, r, n, o) {
                    if ("m" === n) throw new TypeError("Private method is not writable");
                    if ("a" === n && !o) throw new TypeError("Private accessor was defined without a setter");
                    if ("function" == typeof t ? e !== t || !o : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return "a" === n ? o.call(e, r) : o ? o.value = r : t.set(e, r), r;
                }
                function M(e, t) {
                    if (null === t || "object" != typeof t && "function" != typeof t) throw new TypeError("Cannot use 'in' operator on non-object");
                    return "function" == typeof e ? t === e : e.has(t);
                }
                function D(e, t, r) {
                    if (null != t) {
                        if ("object" != typeof t && "function" != typeof t) throw new TypeError("Object expected.");
                        var n;
                        if (r) {
                            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                            n = t[Symbol.asyncDispose];
                        }
                        if (void 0 === n) {
                            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                            n = t[Symbol.dispose];
                        }
                        if ("function" != typeof n) throw new TypeError("Object not disposable.");
                        e.stack.push({
                            value: t,
                            dispose: n,
                            async: r
                        });
                    } else r && e.stack.push({
                        async: !0
                    });
                    return t;
                }
                var I = "function" == typeof SuppressedError ? SuppressedError : function(e, t, r) {
                    var n = new Error(r);
                    return n.name = "SuppressedError", n.error = e, n.suppressed = t, n;
                };
                function q(e) {
                    function t(t) {
                        e.error = e.hasError ? new I(t, e.error, "An error was suppressed during disposal.") : t, e.hasError = !0;
                    }
                    return function r() {
                        for(; e.stack.length;){
                            var n = e.stack.pop();
                            try {
                                var o = n.dispose && n.dispose.call(n.value);
                                if (n.async) return Promise.resolve(o).then(r, function(e) {
                                    return t(e), r();
                                });
                            } catch (e) {
                                t(e);
                            }
                        }
                        if (e.hasError) throw e.error;
                    }();
                }
                t.default = {
                    __extends: o,
                    __assign: i,
                    __rest: a,
                    __decorate: c,
                    __param: s,
                    __metadata: p,
                    __awaiter: h,
                    __generator: y,
                    __createBinding: b,
                    __exportStar: v,
                    __values: g,
                    __read: m,
                    __spread: _,
                    __spreadArrays: w,
                    __spreadArray: P,
                    __await: O,
                    __asyncGenerator: x,
                    __asyncDelegator: S,
                    __asyncValues: E,
                    __makeTemplateObject: T,
                    __importStar: C,
                    __importDefault: A,
                    __classPrivateFieldGet: k,
                    __classPrivateFieldSet: R,
                    __classPrivateFieldIn: M,
                    __addDisposableResource: D,
                    __disposeResources: q
                };
            }
        }, n = {};
        function o(e) {
            var t = n[e];
            if (void 0 !== t) return t.exports;
            var i = n[e] = {
                exports: {}
            };
            return r[e](i, i.exports, o), i.exports;
        }
        o.d = function(e, t) {
            for(var r in t)o.o(t, r) && !o.o(e, r) && Object.defineProperty(e, r, {
                enumerable: !0,
                get: t[r]
            });
        }, o.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }, o.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            });
        };
        var i = {};
        return function() {
            var e = i;
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.useReactToPrint = e.ReactToPrint = e.PrintContextConsumer = void 0;
            var t = o(328);
            Object.defineProperty(e, "PrintContextConsumer", {
                enumerable: !0,
                get: function() {
                    return t.PrintContextConsumer;
                }
            });
            var r = o(428);
            Object.defineProperty(e, "ReactToPrint", {
                enumerable: !0,
                get: function() {
                    return r.ReactToPrint;
                }
            });
            var n = o(892);
            Object.defineProperty(e, "useReactToPrint", {
                enumerable: !0,
                get: function() {
                    return n.useReactToPrint;
                }
            });
            var a = o(428);
            e.default = a.ReactToPrint;
        }(), i;
    }();
});
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s({
    "__iconNode": (()=>__iconNode),
    "default": (()=>Printer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
            key: "143wyd"
        }
    ],
    [
        "path",
        {
            d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",
            key: "1itne7"
        }
    ],
    [
        "rect",
        {
            x: "6",
            y: "14",
            width: "12",
            height: "8",
            rx: "1",
            key: "1ue0tg"
        }
    ]
];
const Printer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Printer", __iconNode);
;
 //# sourceMappingURL=printer.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Printer": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript)");
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s({
    "__iconNode": (()=>__iconNode),
    "default": (()=>User)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
            key: "975kel"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "7",
            r: "4",
            key: "17ys0d"
        }
    ]
];
const User = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("User", __iconNode);
;
 //# sourceMappingURL=user.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "User": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript)");
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s({
    "__iconNode": (()=>__iconNode),
    "default": (()=>Calendar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M8 2v4",
            key: "1cmpym"
        }
    ],
    [
        "path",
        {
            d: "M16 2v4",
            key: "4m81vk"
        }
    ],
    [
        "rect",
        {
            width: "18",
            height: "18",
            x: "3",
            y: "4",
            rx: "2",
            key: "1hopcy"
        }
    ],
    [
        "path",
        {
            d: "M3 10h18",
            key: "8toen8"
        }
    ]
];
const Calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Calendar", __iconNode);
;
 //# sourceMappingURL=calendar.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Calendar": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript)");
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s({
    "__iconNode": (()=>__iconNode),
    "default": (()=>Truck)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
            key: "wrbu53"
        }
    ],
    [
        "path",
        {
            d: "M15 18H9",
            key: "1lyqi6"
        }
    ],
    [
        "path",
        {
            d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
            key: "lysw3i"
        }
    ],
    [
        "circle",
        {
            cx: "17",
            cy: "18",
            r: "2",
            key: "332jqn"
        }
    ],
    [
        "circle",
        {
            cx: "7",
            cy: "18",
            r: "2",
            key: "19iecd"
        }
    ]
];
const Truck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Truck", __iconNode);
;
 //# sourceMappingURL=truck.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Truck": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript)");
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/microscope.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s({
    "__iconNode": (()=>__iconNode),
    "default": (()=>Microscope)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M6 18h8",
            key: "1borvv"
        }
    ],
    [
        "path",
        {
            d: "M3 22h18",
            key: "8prr45"
        }
    ],
    [
        "path",
        {
            d: "M14 22a7 7 0 1 0 0-14h-1",
            key: "1jwaiy"
        }
    ],
    [
        "path",
        {
            d: "M9 14h2",
            key: "197e7h"
        }
    ],
    [
        "path",
        {
            d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",
            key: "1bmzmy"
        }
    ],
    [
        "path",
        {
            d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",
            key: "1drr47"
        }
    ]
];
const Microscope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Microscope", __iconNode);
;
 //# sourceMappingURL=microscope.js.map
}}),
"[project]/node_modules/lucide-react/dist/esm/icons/microscope.js [app-client] (ecmascript) <export default as Microscope>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Microscope": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$microscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$microscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/microscope.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_dd223494._.js.map