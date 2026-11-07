#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    // On garde a[i] (i compté à partir de 1) seulement si a[i] - i >= 0 ; les valeurs gardées
    // doivent alors former une sous-suite croissante au sens large de b[i] = a[i] - i.
    vector<long long> fins;  // fins[L-1] = plus petite fin possible d'une sous-suite de longueur L
    for (int i = 1; i <= n; i++) {
        long long a;
        cin >> a;
        long long b = a - i;
        if (b < 0) continue;  // il n'y a pas assez d'entiers >= 1 pour placer les valeurs d'avant
        auto it = upper_bound(fins.begin(), fins.end(), b);  // upper_bound : les égalités sont permises
        if (it == fins.end()) fins.push_back(b);
        else *it = b;
    }
    cout << n - (int)fins.size() << "\n";
    return 0;
}
