export function sdpMudgeAudioRedEnc(sdp: string): string {
    // Parse the SDP to find the m= line
    const lines = sdp.split('\n');
    const mLineIndex = lines.findIndex(line => line.startsWith('m='));
    if (mLineIndex === -1) {
        console.error('❌ No media line found in SDP');
        return sdp;
    }

    // Add the RED encoder pt in the m= line
    const mLine = lines[mLineIndex];
    lines[mLineIndex] = mLine.replace('111', '63 111');

    // Add the RED encoder sdp lines
    const redRtpMap = 'a=rtpmap:63 red/48000/2';
    const redFmtp = 'a=fmtp:63 111/111';

    // Insert the RED encoder lines after the a=fmpt:111 line
    const fmtpIndex = lines.findIndex(line => line.startsWith('a=fmtp:111'));
    if (fmtpIndex === -1) {
        console.error('❌ No fmtp line for pt 111 found in SDP');
        return sdp;
    }
    lines.splice(fmtpIndex + 1, 0, redRtpMap);
    lines.splice(fmtpIndex + 2, 0, redFmtp);

    return lines.join('\n');
}
