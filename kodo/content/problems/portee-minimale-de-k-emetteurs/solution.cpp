#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

vector<long long> x;

// nombre minimal d'émetteurs de portée r pour couvrir toutes les maisons
int emetteurs(long long r) {
    int nb = 0;
    long long couvert = -1;          // dernière position couverte
    for (long long pos : x) {
        if (pos > couvert) {
            nb++;
            couvert = pos + 2 * r;   // émetteur placé en pos + r
        }
    }
    return nb;
}

int main() {
    int n, k;
    cin >> n >> k;
    x.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> x[i];
    }
    sort(x.begin(), x.end());
    long long lo = -1, hi = 1000000000;   // invariant : lo ne convient pas, hi convient
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (emetteurs(mid) <= k) {
            hi = mid;
        } else {
            lo = mid;
        }
    }
    cout << hi << "\n";
    return 0;
}
