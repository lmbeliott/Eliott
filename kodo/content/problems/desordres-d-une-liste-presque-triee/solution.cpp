#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    long long echanges = 0;
    for (int i = 1; i < n; i++) {
        // insertion de a[i] dans la partie déjà triée a[0..i-1]
        int j = i;
        while (j > 0 && a[j - 1] > a[j]) {
            swap(a[j - 1], a[j]);
            echanges++;              // chaque échange supprime exactement un désordre
            j--;
        }
    }
    cout << echanges << "\n";
    return 0;
}
