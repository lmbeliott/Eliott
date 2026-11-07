#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> w(n), s(n);
    vector<int> ordre(n);
    for (int i = 0; i < n; i++) {
        cin >> w[i] >> s[i];
        ordre[i] = i;
    }
    // du haut vers le bas, w + s croissant
    sort(ordre.begin(), ordre.end(), [&](int a, int b) { return w[a] + s[a] < w[b] + s[b]; });
    long long dessus = 0;                   // poids des caisses déjà posées au-dessus
    long long pire = dessus - s[ordre[0]];
    for (int i : ordre) {
        pire = max(pire, dessus - s[i]);
        dessus += w[i];
    }
    cout << pire << "\n";
    return 0;
}
