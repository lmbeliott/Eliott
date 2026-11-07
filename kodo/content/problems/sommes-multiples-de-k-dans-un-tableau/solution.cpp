#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;

    vector<long long> cpt(k, 0);   // cpt[r] : valeurs déjà lues de reste r
    long long total = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        int r = x % k;
        total += cpt[(k - r) % k];   // partenaires lus avant x
        cpt[r]++;
    }
    cout << total << "\n";
    return 0;
}
