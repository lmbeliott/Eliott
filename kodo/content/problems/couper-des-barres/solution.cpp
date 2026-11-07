#include <iostream>
#include <vector>
using namespace std;

int n;
long long k;
vector<long long> barres;

bool possible(long long x) {
    // nombre minimal de coupes pour que tous les morceaux mesurent au plus x
    long long coupes = 0;
    for (long long l : barres) {
        coupes += (l + x - 1) / x - 1;
    }
    return coupes <= k;
}

int main() {
    cin >> n >> k;
    barres.resize(n);
    long long hi = 0;
    for (int i = 0; i < n; i++) {
        cin >> barres[i];
        if (barres[i] > hi) {
            hi = barres[i];
        }
    }
    long long lo = 0;             // invariant : lo impossible, hi possible
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (possible(mid)) {
            hi = mid;
        } else {
            lo = mid;
        }
    }
    cout << hi << "\n";
    return 0;
}
