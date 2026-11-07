#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    unordered_map<long long, int> deja_vus;   // valeur -> nombre d'apparitions avant la position courante
    long long paires = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        // chaque valeur k - x vue plus tôt forme une paire avec x
        if (deja_vus.count(k - x) > 0) {
            paires = paires + deja_vus[k - x];
        }
        deja_vus[x]++;
    }
    cout << paires << "\n";
    return 0;
}
